import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Footer';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

describe('Footer', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </BrowserRouter>
    );
  });

  it('renders contact information', () => {
    expect(screen.getByText('contact@matex.com')).toBeInTheDocument();
    expect(screen.getByText('+1 (234) 567-890')).toBeInTheDocument();
  });

  it('renders social media links', () => {
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/103787906');
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/matex.leb?igsh=MWN6azR0cnV4MXBlNg%3D%3D&utm_source=qr');
  });

  it('renders newsletter subscription form', () => {
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
  });
});