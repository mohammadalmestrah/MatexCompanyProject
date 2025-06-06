import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
    signIn: vi.fn(),
    loading: false
  })
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  it('renders the logo and company name', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Matex')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(screen.getByText('Careers')).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    renderWithRouter(<Navbar />);
    const menuButton = screen.getByRole('button', { name: /menu/i });
    
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation')).toBeVisible();
    
    fireEvent.click(menuButton);
    expect(screen.queryByRole('navigation')).not.toBeVisible();
  });
});