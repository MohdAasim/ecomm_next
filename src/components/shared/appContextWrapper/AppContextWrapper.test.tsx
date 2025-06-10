import { render } from '@testing-library/react';
import AppContextWrapper from './AppContextWrapper';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

describe('AppContextWrapper', () => {
  const mockSyncCartToBackend = jest.fn();

  const renderWithContext = (isAuthenticated: boolean) => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated });
    (useCart as jest.Mock).mockReturnValue({
      syncCartToBackend: mockSyncCartToBackend,
    });

    render(
      <AppContextWrapper>
        <div>Child Component</div>
      </AppContextWrapper>
    );
  };

  beforeEach(() => {
    mockSyncCartToBackend.mockClear();
  });

  it('renders children', () => {
    renderWithContext(false);
    expect(document.body.textContent).toContain('Child Component');
  });

  it('calls syncCartToBackend when authenticated and not synced yet', () => {
    renderWithContext(true);
    expect(mockSyncCartToBackend).toHaveBeenCalledTimes(1);
  });

  it('does not call syncCartToBackend again if already synced', () => {
    const isAuthenticated = true;

    (useAuth as jest.Mock).mockImplementation(() => ({ isAuthenticated }));
    (useCart as jest.Mock).mockReturnValue({
      syncCartToBackend: mockSyncCartToBackend,
    });

    const { rerender } = render(
      <AppContextWrapper>
        <div>Child</div>
      </AppContextWrapper>
    );

    expect(mockSyncCartToBackend).toHaveBeenCalledTimes(1);

    rerender(
      <AppContextWrapper>
        <div>Child</div>
      </AppContextWrapper>
    );

    expect(mockSyncCartToBackend).toHaveBeenCalledTimes(1);
  });

  it('resets hasSynced when user logs out and calls sync again on re-auth', () => {
    // First render: authenticated
    renderWithContext(true);
    expect(mockSyncCartToBackend).toHaveBeenCalledTimes(1);

    // Log out
    renderWithContext(false);

    // Re-login
    renderWithContext(true);
    expect(mockSyncCartToBackend).toHaveBeenCalledTimes(2);
  });
});
