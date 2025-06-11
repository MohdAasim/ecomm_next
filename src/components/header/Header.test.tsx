import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

// Mock the dependencies
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('./HeaderClient', () => ({
  useHasMounted: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Import the mocked functions
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useHasMounted } from './HeaderClient';
import { useRouter, usePathname } from 'next/navigation';

// Strictly typed interfaces based on your actual models
interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

interface AuthContextType {
  readonly isAuthenticated: boolean;
  readonly login: (credentials: LoginCredentials) => Promise<void>;
  readonly logout: () => void;
}

interface CartContextType {
  readonly cartItems: CartItem[] | null;
  readonly addToCart: (productId: number, quantity?: number) => Promise<void>;
  readonly removeFromCart: (productId: number) => Promise<void>;
  readonly updateQuantity: (
    productId: number,
    quantity: number
  ) => Promise<void>;
  readonly clearCart: () => Promise<void>;
  readonly syncCartToBackend: () => Promise<void>;
}

interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

// Simple type-safe mock declarations
const mockUseAuth = useAuth as jest.Mock;
const mockUseCart = useCart as jest.Mock;
const mockUseHasMounted = useHasMounted as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe('Header Component', () => {
  // Individual mock functions
  const mockPush = jest.fn();
  const mockLogout = jest.fn();
  const mockLogin = jest.fn();
  const mockAddToCart = jest.fn();
  const mockRemoveFromCart = jest.fn();
  const mockUpdateQuantity = jest.fn();
  const mockClearCart = jest.fn();
  const mockSyncCartToBackend = jest.fn();

  // Factory functions
  const createMockCartItems = (count: number): CartItem[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Item ${index + 1}`,
      price: (index + 1) * 100,
      quantity: 1,
    }));
  };

  const createMockAuthContext = (
    isAuthenticated: boolean
  ): AuthContextType => ({
    isAuthenticated,
    login: mockLogin,
    logout: mockLogout,
  });

  const createMockCartContext = (
    cartItems: CartItem[] | null = []
  ): CartContextType => ({
    cartItems,
    addToCart: mockAddToCart,
    removeFromCart: mockRemoveFromCart,
    updateQuantity: mockUpdateQuantity,
    clearCart: mockClearCart,
    syncCartToBackend: mockSyncCartToBackend,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    });

    mockUsePathname.mockReturnValue('/');
    mockUseHasMounted.mockReturnValue(true);
    mockUseCart.mockReturnValue(createMockCartContext());
    mockUseAuth.mockReturnValue(createMockAuthContext(false));
  });

  describe('Rendering', () => {
    it('should render header with logo and navigation', () => {
      render(<Header />);

      expect(screen.getByText('Ecomm')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
      expect(screen.getByText('Cart (0)')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '☰' })).toBeInTheDocument();
    });

    it('should render header element with correct class', () => {
      const { container } = render(<Header />);
      const headerElement = container.firstChild as HTMLElement;

      expect(headerElement).toHaveClass('header');
    });

    it('should render logo as link to home', () => {
      render(<Header />);

      const logoLink = screen.getByRole('link', { name: 'Ecomm' });
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render hamburger menu button', () => {
      render(<Header />);

      const hamburgerButton = screen.getByRole('button', { name: '☰' });
      expect(hamburgerButton).toHaveClass('hamburger');
    });
  });

  describe('Cart Display', () => {
    it('should display cart with 0 items when cart is empty', () => {
      mockUseCart.mockReturnValue(createMockCartContext([]));

      render(<Header />);

      expect(screen.getByText('Cart (0)')).toBeInTheDocument();
    });

    it('should display correct cart item count', () => {
      const mockCartItems = createMockCartItems(3);
      mockUseCart.mockReturnValue(createMockCartContext(mockCartItems));

      render(<Header />);

      expect(screen.getByText('Cart (3)')).toBeInTheDocument();
    });

    it('should handle null cart items gracefully', () => {
      mockUseCart.mockReturnValue(createMockCartContext(null));

      render(<Header />);

      expect(screen.getByText('Cart (0)')).toBeInTheDocument();
    });
  });

  describe('Authentication States', () => {
    it('should show Sign In when user is not authenticated', () => {
      mockUseAuth.mockReturnValue(createMockAuthContext(false));

      render(<Header />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });

    it('should show Sign Out when user is authenticated', () => {
      mockUseAuth.mockReturnValue(createMockAuthContext(true));

      render(<Header />);

      expect(screen.getByText('Sign Out')).toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('should not show auth buttons when component has not mounted', () => {
      mockUseHasMounted.mockReturnValue(false);

      render(<Header />);

      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Menu Toggle', () => {
    it('should toggle mobile menu when hamburger is clicked', () => {
      render(<Header />);

      const hamburgerButton = screen.getByRole('button', { name: '☰' });
      const nav = screen.getByRole('navigation');

      // Initially menu should be closed
      expect(nav).not.toHaveClass('open');

      // Click to open
      fireEvent.click(hamburgerButton);
      expect(nav).toHaveClass('open');

      // Click to close
      fireEvent.click(hamburgerButton);
      expect(nav).not.toHaveClass('open');
    });

    it('should close menu when navigation links are clicked', () => {
      render(<Header />);

      const hamburgerButton = screen.getByRole('button', { name: '☰' });
      const aboutLink = screen.getByText('About Us');
      const nav = screen.getByRole('navigation');

      // Open menu
      fireEvent.click(hamburgerButton);
      expect(nav).toHaveClass('open');

      // Click navigation link
      fireEvent.click(aboutLink);
      expect(nav).not.toHaveClass('open');
    });

    it('should close menu when cart link is clicked', () => {
      render(<Header />);

      const hamburgerButton = screen.getByRole('button', { name: '☰' });
      const cartLink = screen.getByText('Cart (0)');
      const nav = screen.getByRole('navigation');

      // Open menu
      fireEvent.click(hamburgerButton);
      expect(nav).toHaveClass('open');

      // Click cart link
      fireEvent.click(cartLink);
      expect(nav).not.toHaveClass('open');
    });
  });

  describe('Sign In Functionality', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(createMockAuthContext(false));
    });

    it('should redirect to sign in page when Sign In is clicked', () => {
      mockUsePathname.mockReturnValue('/products');

      render(<Header />);

      const signInButton = screen.getByText('Sign In');
      fireEvent.click(signInButton);

      expect(mockPush).toHaveBeenCalledWith('/signin?from=%2Fproducts');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('should close mobile menu when Sign In is clicked', () => {
      render(<Header />);

      const hamburgerButton = screen.getByRole('button', { name: '☰' });
      const signInButton = screen.getByText('Sign In');
      const nav = screen.getByRole('navigation');

      // Open menu
      fireEvent.click(hamburgerButton);
      expect(nav).toHaveClass('open');

      // Click Sign In
      fireEvent.click(signInButton);
      expect(nav).not.toHaveClass('open');
    });

    it('should encode current pathname correctly for redirect', () => {
      mockUsePathname.mockReturnValue(
        '/products?category=electronics&sort=price'
      );

      render(<Header />);

      const signInButton = screen.getByText('Sign In');
      fireEvent.click(signInButton);

      expect(mockPush).toHaveBeenCalledWith(
        '/signin?from=%2Fproducts%3Fcategory%3Delectronics%26sort%3Dprice'
      );
    });
  });

  describe('Sign Out Functionality', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue(createMockAuthContext(true));
    });

    it('should call logout when Sign Out is clicked', () => {
      render(<Header />);

      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it('should close mobile menu when Sign Out is clicked', () => {
      render(<Header />);

      const hamburgerButton = screen.getByRole('button', { name: '☰' });
      const signOutButton = screen.getByText('Sign Out');
      const nav = screen.getByRole('navigation');

      // Open menu
      fireEvent.click(hamburgerButton);
      expect(nav).toHaveClass('open');

      // Click Sign Out
      fireEvent.click(signOutButton);
      expect(nav).not.toHaveClass('open');
    });
  });

  describe('Navigation Links', () => {
    it('should render About Us link with correct href', () => {
      render(<Header />);

      const aboutLink = screen.getByRole('link', { name: 'About Us' });
      expect(aboutLink).toHaveAttribute('href', '/about');
    });

    it('should render Cart link with correct href', () => {
      render(<Header />);

      const cartLink = screen.getByRole('link', { name: 'Cart (0)' });
      expect(cartLink).toHaveAttribute('href', '/cart');
    });

    it('should update cart link text when cart items change', () => {
      const mockCartItems = createMockCartItems(5);
      mockUseCart.mockReturnValue(createMockCartContext(mockCartItems));

      render(<Header />);

      const cartLink = screen.getByRole('link', { name: 'Cart (5)' });
      expect(cartLink).toHaveAttribute('href', '/cart');
    });
  });

  describe('Edge Cases', () => {
    it('should handle authentication state changes', () => {
      const { rerender } = render(<Header />);

      // Initially not authenticated
      expect(screen.getByText('Sign In')).toBeInTheDocument();

      // Change to authenticated
      mockUseAuth.mockReturnValue(createMockAuthContext(true));

      rerender(<Header />);
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('should handle cart items changes', () => {
      const { rerender } = render(<Header />);

      // Initially empty cart
      expect(screen.getByText('Cart (0)')).toBeInTheDocument();

      // Add items to cart
      const updatedCartItems = createMockCartItems(2);
      mockUseCart.mockReturnValue(createMockCartContext(updatedCartItems));

      rerender(<Header />);
      expect(screen.getByText('Cart (2)')).toBeInTheDocument();
    });

    it('should handle large cart item counts', () => {
      const largeCartItems = createMockCartItems(99);
      mockUseCart.mockReturnValue(createMockCartContext(largeCartItems));

      render(<Header />);

      expect(screen.getByText('Cart (99)')).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should not render auth buttons during SSR', () => {
      mockUseHasMounted.mockReturnValue(false);

      render(<Header />);

      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });

    it('should render auth buttons after component mounts', () => {
      mockUseHasMounted.mockReturnValue(true);

      render(<Header />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing cart context gracefully', () => {
      mockUseCart.mockReturnValue({
        cartItems: null,
        addToCart: mockAddToCart,
        removeFromCart: mockRemoveFromCart,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
        syncCartToBackend: mockSyncCartToBackend,
      });

      expect(() => {
        render(<Header />);
      }).not.toThrow();

      expect(screen.getByText('Cart (0)')).toBeInTheDocument();
    });

    it('should handle cart items with zero quantity', () => {
      const cartItemsWithZero = [
        { id: 1, name: 'Item 1', price: 100, quantity: 0 },
        { id: 2, name: 'Item 2', price: 200, quantity: 1 },
      ];
      mockUseCart.mockReturnValue(createMockCartContext(cartItemsWithZero));

      render(<Header />);

      expect(screen.getByText('Cart (2)')).toBeInTheDocument();
    });
  });
});
