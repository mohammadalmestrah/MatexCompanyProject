import os
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
import re

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="Matex AI Chatbot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


# In-memory session store (for demo). Replace with Redis in production.
SESSION_MEMORY: Dict[str, List[Dict[str, str]]] = {}
OTP_STORE: Dict[str, Dict[str, object]] = {}
TOTP_STORE: Dict[str, Dict[str, str]] = {}


def get_or_create_session(session_id: Optional[str]) -> str:
    if session_id and session_id in SESSION_MEMORY:
        return session_id
    new_id = session_id or os.urandom(8).hex()
    SESSION_MEMORY.setdefault(new_id, [])
    return new_id


COMPANY_KNOWLEDGE = """
You are Matex's AI assistant. Matex is a technology solutions company founded by Mohammad ALMESTRAH.
We provide: AI solutions, software development, cloud services, and technology consulting.
Locations: Baabda, Mount Lebanon. Primary email: contact@matex.com. Phone: +1 (234) 567-890.
If unsure, ask a concise clarifying question.
Be professional, concise, and friendly. Keep answers under 150 words by default.
"""


def build_system_prompt() -> str:
    return COMPANY_KNOWLEDGE


def call_openai(messages: List[Dict[str, str]]) -> str:
    if not OPENAI_API_KEY:
        # Fallback simple rule-based response if API key is missing
        last = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        if "price" in last.lower() or "cost" in last.lower():
            return "For pricing, please contact us at contact@matex.com with your project details."
        if "services" in last.lower():
            return "We offer AI solutions, software development, cloud services, and consulting."
        if "contact" in last.lower() or "email" in last.lower():
            return "You can reach us at contact@matex.com or +1 (234) 567-890."
        return "I'm here to help with Matex information. How can I assist you today?"

    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2,
        max_tokens=300,
    )
    return response.choices[0].message.content or ""


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    sid = get_or_create_session(req.session_id)
    history = SESSION_MEMORY[sid]

    system_prompt = build_system_prompt()
    openai_messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}] + history + [
        {"role": "user", "content": req.message.strip()}
    ]

    try:
        answer = call_openai(openai_messages)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {e}")

    # Update memory
    history.append({"role": "user", "content": req.message.strip()})
    history.append({"role": "assistant", "content": answer})
    SESSION_MEMORY[sid] = history[-20:]  # keep last 20 turns

    return ChatResponse(response=answer, session_id=sid)


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ----------------------
# Custom Email OTP (SMTP)
# ----------------------

class OtpRequest(BaseModel):
    email: str


class OtpVerify(BaseModel):
    email: str
    code: str


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER or "no-reply@matex.local")
DEV_RETURN_CODE = os.getenv("DEV_RETURN_OTP_IN_RESPONSE", "false").lower() == "true"


def is_valid_email(value: str) -> bool:
    return re.match(r"^.+@.+\..+$", value or "") is not None


def send_otp_email(recipient: str, code: str) -> None:
    if not (SMTP_HOST and SMTP_USER and SMTP_PASS):
        # Fallback: log only
        print(f"[OTP] Code for {recipient}: {code}")
        return

    msg = EmailMessage()
    msg["Subject"] = "Your Matex verification code"
    msg["From"] = SMTP_FROM
    msg["To"] = recipient
    msg.set_content(
        f"Your verification code is: {code}\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email."
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)


@app.post("/api/otp/request")
def request_otp(payload: OtpRequest):
    email = (payload.email or "").strip().lower()
    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")

    now = datetime.utcnow()
    record = OTP_STORE.get(email)
    if record and record.get("next_allowed") and now < record["next_allowed"]:  # type: ignore
        raise HTTPException(status_code=429, detail="Too many requests. Try again shortly.")

    code = f"{int.from_bytes(os.urandom(3), 'big') % 1000000:06d}"
    OTP_STORE[email] = {
        "code": code,
        "expires": now + timedelta(minutes=10),
        "attempts": 0,
        "next_allowed": now + timedelta(seconds=45),
    }

    try:
        send_otp_email(email, code)
    except Exception as e:
        print(f"[OTP] Email send failed: {e}")
        # Still keep the code stored; client can retrieve if dev flag is on

    response: Dict[str, object] = {"ok": True}
    if DEV_RETURN_CODE:
        response["code"] = code
    return response


@app.post("/api/otp/verify")
def verify_otp(payload: OtpVerify):
    email = (payload.email or "").strip().lower()
    code = (payload.code or "").strip()
    if not is_valid_email(email) or not code:
        raise HTTPException(status_code=400, detail="Invalid payload")

    record = OTP_STORE.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="No code requested")

    now = datetime.utcnow()
    if now > record["expires"]:  # type: ignore
        raise HTTPException(status_code=400, detail="Code expired")

    if record["attempts"] is not None and record["attempts"] >= 5:  # type: ignore
        raise HTTPException(status_code=429, detail="Too many attempts")

    if code != record["code"]:  # type: ignore
        record["attempts"] = int(record.get("attempts", 0)) + 1
        OTP_STORE[email] = record
        raise HTTPException(status_code=400, detail="Invalid code")

    # Success: create a lightweight session token
    token = os.urandom(16).hex()
    SESSION_MEMORY[token] = [{"role": "system", "content": f"otp_login:{email}"}]
    # Optionally clear OTP after success
    OTP_STORE.pop(email, None)
    return {"ok": True, "token": token, "email": email}


################################
# 2FA TOTP (e.g., Google Auth) #
################################

class TotpSetupRequest(BaseModel):
    email: str


class TotpVerifyRequest(BaseModel):
    email: str
    code: str


try:
    import pyotp  # type: ignore
except Exception:  # pragma: no cover
    pyotp = None  # type: ignore


@app.post("/api/2fa/setup")
def setup_2fa(payload: TotpSetupRequest):
    if pyotp is None:
        raise HTTPException(status_code=500, detail="pyotp not installed on server")
    email = (payload.email or "").strip().lower()
    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail="Invalid email")

    record = TOTP_STORE.get(email)
    secret = record["secret"] if record else pyotp.random_base32()  # type: ignore
    TOTP_STORE[email] = {"secret": secret}

    issuer = "Matex"
    uri = pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name=issuer)  # type: ignore
    return {"secret": secret, "otpauth_url": uri}


@app.post("/api/2fa/verify")
def verify_2fa(payload: TotpVerifyRequest):
    if pyotp is None:
        raise HTTPException(status_code=500, detail="pyotp not installed on server")
    email = (payload.email or "").strip().lower()
    code = (payload.code or "").strip()
    if not is_valid_email(email) or not code:
        raise HTTPException(status_code=400, detail="Invalid payload")

    record = TOTP_STORE.get(email)
    if not record:
        raise HTTPException(status_code=400, detail="2FA not set up")

    totp = pyotp.TOTP(record["secret"])  # type: ignore
    if not totp.verify(code, valid_window=1):  # type: ignore
        raise HTTPException(status_code=400, detail="Invalid 2FA code")

    return {"ok": True}


# Payments removed by request

