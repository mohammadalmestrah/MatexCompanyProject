import os
from typing import Dict, List, Optional, Any

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
import json
import re
import glob

# Import ML model
from ml_chatbot_model import get_ml_model

# Lightweight local retrieval
try:  # pragma: no cover
    from rank_bm25 import BM25Okapi  # type: ignore
except Exception:  # pragma: no cover
    BM25Okapi = None  # type: ignore

try:  # pragma: no cover
    from pypdf import PdfReader  # type: ignore
except Exception:  # pragma: no cover
    PdfReader = None  # type: ignore

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI(title="Matex AI Chatbot", version="1.1.0")

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
    use_ml: Optional[bool] = True


class ChatResponse(BaseModel):
    response: str
    session_id: str
    predicted_category: Optional[str] = None
    confidence: Optional[float] = None
    confidence_level: Optional[str] = None


class FeedbackRequest(BaseModel):
    message: str
    correct_category: Optional[str] = None
    user_satisfaction: Optional[float] = None
    feedback_text: Optional[str] = None


class TrainingRequest(BaseModel):
    force_retrain: Optional[bool] = False


# In-memory session store (for demo). Replace with Redis in production.
SESSION_MEMORY: Dict[str, List[Dict[str, str]]] = {}
OTP_STORE: Dict[str, Dict[str, object]] = {}
TOTP_STORE: Dict[str, Dict[str, str]] = {}

# Load response categories for ML training
RESPONSE_CATEGORIES = None


# -------------------------------------------------
# Local RAG knowledge base (BM25 over text chunks)
# -------------------------------------------------
KNOWLEDGE_DIR = os.path.join("server", "data", "knowledge")
KB_INDEX = None  # type: ignore
KB_TOKENS: List[List[str]] = []
KB_CHUNKS: List[Dict[str, str]] = []  # {id, doc, text}
KB_META: Dict[str, Any] = {
    "doc_count": 0,
    "chunk_count": 0,
    "last_indexed_at": None,
}


def _ensure_knowledge_dir() -> None:
    os.makedirs(KNOWLEDGE_DIR, exist_ok=True)


def _simple_tokenize(text: str) -> List[str]:
    return re.findall(r"[\w']+", (text or "").lower())


def _chunk_text(text: str, max_chars: int = 800, overlap: int = 150) -> List[str]:
    text = (text or "").strip()
    if not text:
        return []
    chunks: List[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        chunks.append(text[start:end])
        if end == len(text):
            break
        start = max(0, end - overlap)
    return chunks


def _read_text_file(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception:
        return ""


def _read_pdf_file(path: str) -> str:
    if PdfReader is None:
        return ""
    try:
        reader = PdfReader(path)
        pages_text = [p.extract_text() or "" for p in reader.pages]
        return "\n".join(pages_text)
    except Exception:
        return ""


def build_kb_index() -> Dict[str, Any]:
    """Rebuild the BM25 index from files in KNOWLEDGE_DIR."""
    global KB_INDEX, KB_TOKENS, KB_CHUNKS, KB_META
    _ensure_knowledge_dir()

    KB_CHUNKS = []
    KB_TOKENS = []

    files = (
        glob.glob(os.path.join(KNOWLEDGE_DIR, "**", "*.txt"), recursive=True)
        + glob.glob(os.path.join(KNOWLEDGE_DIR, "**", "*.md"), recursive=True)
        + glob.glob(os.path.join(KNOWLEDGE_DIR, "**", "*.pdf"), recursive=True)
    )

    doc_count = 0
    for fp in files:
        ext = os.path.splitext(fp)[1].lower()
        if ext in (".txt", ".md"):
            raw = _read_text_file(fp)
        elif ext == ".pdf":
            raw = _read_pdf_file(fp)
        else:
            raw = ""
        if not raw:
            continue
        doc_name = os.path.basename(fp)
        for idx, chunk in enumerate(_chunk_text(raw)):
            KB_CHUNKS.append({
                "id": f"{doc_name}:{idx}",
                "doc": doc_name,
                "text": chunk.strip(),
            })
            KB_TOKENS.append(_simple_tokenize(chunk))
        doc_count += 1

    if KB_TOKENS and BM25Okapi is not None:
        KB_INDEX = BM25Okapi(KB_TOKENS)  # type: ignore
    else:
        KB_INDEX = None  # type: ignore

    KB_META = {
        "doc_count": doc_count,
        "chunk_count": len(KB_CHUNKS),
        "last_indexed_at": datetime.utcnow().isoformat(),
    }
    return KB_META


def kb_query(query: str, top_n: int = 5) -> List[Dict[str, Any]]:
    if not query or KB_INDEX is None:
        return []
    tokens = _simple_tokenize(query)
    if not tokens:
        return []
    scores = KB_INDEX.get_scores(tokens)  # type: ignore
    ranked = sorted(enumerate(scores), key=lambda x: x[1], reverse=True)[:top_n]
    results: List[Dict[str, Any]] = []
    for i, score in ranked:
        if i < len(KB_CHUNKS):
            ch = KB_CHUNKS[i]
            results.append({"score": float(score), **ch})
    return results


def _rule_based_fallback(user_text: str) -> str:
    last = (user_text or "").strip().lower()
    if "price" in last or "cost" in last:
        return "For pricing, please contact us at contact@matex.com with your project details."
    if "services" in last:
        return "We offer AI solutions, software development, cloud services, and consulting."
    if "contact" in last or "email" in last:
        return "You can reach us at contact@matex.com or +1 (234) 567-890."
    return "I'm here to help with Matex information. How can I assist you today?"


def rag_answer(user_text: str, max_words: int = 140) -> str:
    """Generate a concise answer using top KB chunks when OpenAI is unavailable."""
    results = kb_query(user_text, top_n=4)
    if not results:
        return _rule_based_fallback(user_text)
    joined = " \n".join([r["text"] for r in results])
    # Trim to target word count
    words = joined.split()
    summary = " ".join(words[: max_words])
    return f"Based on our knowledge base: {summary}".strip()


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


def load_response_categories():
    """Load response categories from Node.js data file."""
    global RESPONSE_CATEGORIES
    try:
        # Try to load from Node.js response categories
        categories_path = os.path.join("..", "data", "responseCategories.js")
        if os.path.exists(categories_path):
            with open(categories_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # Simple parsing of JavaScript object (basic implementation)
                # In production, use a proper JS parser
                import re
                
                # Extract categories from JavaScript
                categories = {}
                category_pattern = r'(\w+):\s*\{([^}]+)\}'
                matches = re.findall(category_pattern, content, re.DOTALL)
                
                for cat_name, cat_content in matches:
                    # Extract keywords and responses (simplified parsing)
                    keywords_match = re.search(r'keywords:\s*\[([^\]]+)\]', cat_content)
                    responses_match = re.search(r'responses:\s*\[([^\]]+)\]', cat_content, re.DOTALL)
                    
                    if keywords_match and responses_match:
                        keywords = [k.strip().strip('"\'') for k in keywords_match.group(1).split(',')]
                        responses = [r.strip().strip('"\'') for r in responses_match.group(1).split(',')]
                        
                        categories[cat_name] = {
                            'keywords': keywords,
                            'responses': responses,
                            'context': cat_name
                        }
                
                RESPONSE_CATEGORIES = categories
                print(f"Loaded {len(categories)} response categories")
                return categories
    except Exception as e:
        print(f"Error loading response categories: {e}")
    
    # Fallback to basic categories
    RESPONSE_CATEGORIES = {
        'help': {
            'keywords': ['help', 'assist', 'support'],
            'responses': ['I can help you with information about our services and company.'],
            'context': 'help'
        },
        'services': {
            'keywords': ['services', 'offer', 'what do you do'],
            'responses': ['We offer AI solutions, software development, cloud services, and consulting.'],
            'context': 'services'
        }
    }
    return RESPONSE_CATEGORIES


def call_openai(messages: List[Dict[str, str]]) -> str:
    if not OPENAI_API_KEY:
        # Use local RAG fallback when API key is missing
        last = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        return rag_answer(last)

    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.2,
        max_tokens=300,
    )
    return response.choices[0].message.content or ""


def get_ml_response(message: str) -> Dict[str, Any]:
    """Get ML-powered response."""
    ml_model = get_ml_model()
    
    # Load response categories if not loaded
    if RESPONSE_CATEGORIES is None:
        load_response_categories()
    
    # Generate ML response
    ml_result = ml_model.generate_response(message, RESPONSE_CATEGORIES or {})
    
    # Fallback to OpenAI if confidence is very low
    if ml_result['confidence_level'] in ['very_low'] and OPENAI_API_KEY:
        try:
            openai_response = call_openai([
                {"role": "system", "content": build_system_prompt()},
                {"role": "user", "content": message}
            ])
            ml_result['response'] = openai_response
            ml_result['fallback_used'] = 'openai'
        except:
            pass
    
    return ml_result


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    sid = get_or_create_session(req.session_id)
    history = SESSION_MEMORY[sid]

    # Use ML model if requested and available
    if req.use_ml:
        try:
            ml_result = get_ml_response(req.message.strip())
            answer = ml_result['response']
            predicted_category = ml_result['predicted_category']
            confidence = ml_result['confidence']
            confidence_level = ml_result['confidence_level']
            
            # Add follow-up if available
            if ml_result.get('follow_up'):
                answer += "\n\n" + ml_result['follow_up']
                
        except Exception as e:
            print(f"ML model error: {e}")
            # Fallback to OpenAI
            system_prompt = build_system_prompt()
            openai_messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}] + history + [
                {"role": "user", "content": req.message.strip()}
            ]
            try:
                answer = call_openai(openai_messages)
                predicted_category = None
                confidence = None
                confidence_level = None
            except Exception as e2:
                raise HTTPException(status_code=500, detail=f"AI error: {e2}")
    else:
        # Use OpenAI directly
        system_prompt = build_system_prompt()
        openai_messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}] + history + [
            {"role": "user", "content": req.message.strip()}
        ]
        try:
            answer = call_openai(openai_messages)
            predicted_category = None
            confidence = None
            confidence_level = None
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"AI error: {e}")

    # Update memory
    history.append({"role": "user", "content": req.message.strip()})
    history.append({"role": "assistant", "content": answer})
    SESSION_MEMORY[sid] = history[-20:]  # keep last 20 turns

    return ChatResponse(
        response=answer, 
        session_id=sid,
        predicted_category=predicted_category,
        confidence=confidence,
        confidence_level=confidence_level
    )


@app.get("/api/health")
def health():
    return {"status": "ok", "kb": KB_META}


# ----------------------
# Knowledge Base Endpoints
# ----------------------

class KBText(BaseModel):
    name: Optional[str] = None
    text: str


@app.get("/api/kb/status")
def kb_status():
    return {
        "ok": True,
        "has_index": KB_INDEX is not None,
        "meta": KB_META,
    }


@app.post("/api/kb/reload")
def kb_reload():
    meta = build_kb_index()
    return {"ok": True, "meta": meta}


@app.post("/api/kb/text")
def kb_add_text(payload: KBText):
    _ensure_knowledge_dir()
    name = payload.name or f"snippet_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.txt"
    safe_name = re.sub(r"[^\w\.-]", "_", name)
    path = os.path.join(KNOWLEDGE_DIR, safe_name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(payload.text or "")
    meta = build_kb_index()
    return {"ok": True, "saved_as": safe_name, "meta": meta}


@app.post("/api/kb/upload")
def kb_upload(file: UploadFile = File(...)):
    _ensure_knowledge_dir()
    filename = re.sub(r"[^\w\.-]", "_", file.filename or "uploaded")
    path = os.path.join(KNOWLEDGE_DIR, filename)
    with open(path, "wb") as out:
        out.write(file.file.read())
    meta = build_kb_index()
    return {"ok": True, "saved_as": filename, "meta": meta}


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


# ----------------------
# Simple leads endpoint (MVP)
# ----------------------

class Lead(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    details: Optional[str] = None
    language: Optional[str] = None


@app.post("/api/leads")
def create_lead(lead: Lead):
    payload = lead.model_dump() | {"created_at": datetime.utcnow().isoformat()}
    try:
        path = os.path.join(os.getcwd(), "server", "data", "leads.json")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        existing: list[dict] = []
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                try:
                    existing = json.load(f)
                except Exception:
                    existing = []
        existing.append(payload)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(existing, f, ensure_ascii=False, indent=2)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"ok": True}

# ----------------------
# ML Model Endpoints
# ----------------------

@app.post("/api/ml/train")
def train_ml_model(req: TrainingRequest = TrainingRequest()):
    """Train the ML model with current response categories."""
    try:
        ml_model = get_ml_model()
        
        # Load response categories
        categories = load_response_categories()
        
        # Train the model
        result = ml_model.train_model(categories)
        
        return {
            "ok": True,
            "training_result": result,
            "message": "ML model trained successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {e}")


@app.post("/api/ml/feedback")
def submit_feedback(req: FeedbackRequest):
    """Submit feedback for ML model improvement."""
    try:
        ml_model = get_ml_model()
        
        # Add feedback to training data
        if req.correct_category:
            ml_model.add_training_example(req.message, req.correct_category, req.feedback_text)
        
        # Retrain with feedback if satisfaction is low
        if req.user_satisfaction and req.user_satisfaction < 0.5:
            result = ml_model.retrain_with_feedback(
                req.message, 
                req.correct_category or 'unknown', 
                req.user_satisfaction
            )
            return {
                "ok": True,
                "feedback_recorded": True,
                "retraining_result": result,
                "message": "Feedback recorded and model retrained"
            }
        
        return {
            "ok": True,
            "feedback_recorded": True,
            "message": "Feedback recorded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feedback error: {e}")


@app.get("/api/ml/status")
def ml_model_status():
    """Get ML model status and metrics."""
    try:
        ml_model = get_ml_model()
        status = ml_model.get_model_status()
        
        return {
            "ok": True,
            "model_status": status,
            "message": "ML model status retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Status error: {e}")


@app.post("/api/ml/predict")
def predict_category(message: str):
    """Predict category for a given message."""
    try:
        ml_model = get_ml_model()
        category, confidence = ml_model.predict_category(message)
        
        return {
            "ok": True,
            "predicted_category": category,
            "confidence": confidence,
            "confidence_level": ml_model.get_confidence_level(confidence),
            "message": "Prediction completed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")


# Initialize knowledge base and ML model
_ensure_knowledge_dir()
try:
    build_kb_index()
except Exception as _:
    pass

# Initialize ML model and load response categories
try:
    ml_model = get_ml_model()
    load_response_categories()
    
    # Auto-train the model if not already trained
    if RESPONSE_CATEGORIES and not ml_model.get_model_status()['is_trained']:
        print("Auto-training ML model with response categories...")
        ml_model.train_model(RESPONSE_CATEGORIES)
except Exception as e:
    print(f"ML model initialization error: {e}")

# Payments removed by request

