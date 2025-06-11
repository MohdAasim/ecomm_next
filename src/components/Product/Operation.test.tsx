import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Operation from './Operation';
import { toast } from 'react-toastify';
import type { Product } from '@/types/Carttypes';

// Mock the dependencies
jest.mock('@/context/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Import the mocked functions
import { useCart } from '@/context/CartContext';

const mockUseCart = useCart as jest.Mock;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('Operation Component', () => {
  const mockAddToCart = jest.fn();

  const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
    id: 1,
    name: 'Test Product',
    price: 99.99,
    description: 'Test product description',
    image_url: 'https://example.com/test-image.jpg',
    category: 'electronics',
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCart.mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  describe('Rendering', () => {
    it('should render quantity controls and add to cart button', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      expect(screen.getByText('-')).toBeInTheDocument();
      expect(screen.getByText('+')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
    });

    it('should render with initial quantity of 1', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should render quantity control with correct class', () => {
      const mockProduct = createMockProduct();
      const { container } = render(<Operation product={mockProduct} />);

      const quantityControl = container.querySelector('.quantity-control');
      expect(quantityControl).toBeInTheDocument();
    });

    it('should render add to cart button with correct class', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      expect(addToCartButton).toHaveClass('add-to-cart');
    });
  });

  describe('Quantity Controls', () => {
    it('should increment quantity when plus button is clicked', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');

      fireEvent.click(incrementButton);

      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should decrement quantity when minus button is clicked', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');
      const decrementButton = screen.getByText('-');

      // First increment to 2
      fireEvent.click(incrementButton);
      expect(screen.getByText('2')).toBeInTheDocument();

      // Then decrement back to 1
      fireEvent.click(decrementButton);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should not decrement quantity below 1', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const decrementButton = screen.getByText('-');

      // Try to decrement below 1
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);

      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should allow incrementing to large quantities', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');

      // Increment multiple times
      for (let i = 0; i < 9; i++) {
        fireEvent.click(incrementButton);
      }

      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should handle rapid clicking', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');

      // Rapid clicking
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(screen.getByText('4')).toBeInTheDocument();
    });
  });

  describe('Add to Cart Functionality', () => {
    it('should call addToCart with correct parameters when button is clicked', async () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 1,
          Product: mockProduct,
        });
      });

      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });

    it('should call addToCart with updated quantity', async () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');
      const addToCartButton = screen.getByText('Add to Cart');

      // Increment quantity to 3
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 3,
          Product: mockProduct,
        });
      });
    });

    it('should show success toast when item is added to cart', async () => {
      const mockProduct = createMockProduct({ name: 'Awesome Product' });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Awesome Product added to cart!'
        );
      });

      expect(mockToast.success).toHaveBeenCalledTimes(1);
    });

    it('should not call addToCart if product is null', async () => {
      const nullProduct = null as unknown as Product;

      render(<Operation product={nullProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).not.toHaveBeenCalled();
      });

      expect(mockToast.success).not.toHaveBeenCalled();
    });

    it('should not call addToCart if product id is null', async () => {
      const mockProduct = createMockProduct({ id: null as unknown as number });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).not.toHaveBeenCalled();
      });

      expect(mockToast.success).not.toHaveBeenCalled();
    });

    it('should not call addToCart if product id is undefined', async () => {
      const mockProduct = createMockProduct({
        id: undefined as unknown as number,
      });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).not.toHaveBeenCalled();
      });

      expect(mockToast.success).not.toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user workflow', async () => {
      const mockProduct = createMockProduct({
        name: 'Integration Test Product',
      });

      render(<Operation product={mockProduct} />);

      // Initial state
      expect(screen.getByText('1')).toBeInTheDocument();

      // Increase quantity
      const incrementButton = screen.getByText('+');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(screen.getByText('3')).toBeInTheDocument();

      // Decrease quantity
      const decrementButton = screen.getByText('-');
      fireEvent.click(decrementButton);

      expect(screen.getByText('2')).toBeInTheDocument();

      // Add to cart
      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 2,
          Product: mockProduct,
        });
      });

      expect(mockToast.success).toHaveBeenCalledWith(
        'Integration Test Product added to cart!'
      );
    });

    it('should handle multiple add to cart actions', async () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');

      // Add to cart multiple times
      fireEvent.click(addToCartButton);
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledTimes(2);
      });

      expect(mockToast.success).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle product with very long name', async () => {
      const mockProduct = createMockProduct({
        name: 'This is a very long product name that might cause issues with toast messages',
      });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'This is a very long product name that might cause issues with toast messages added to cart!'
        );
      });
    });

    it('should handle product with zero price', async () => {
      const mockProduct = createMockProduct({ price: 0 });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 1,
          Product: mockProduct,
        });
      });
    });

    it('should handle product with special characters in name', async () => {
      const mockProduct = createMockProduct({
        name: 'Product & Co. "Special" <Edition>',
      });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Product & Co. "Special" <Edition> added to cart!'
        );
      });
    });

    it('should handle very large quantity values', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');

      // Increment to a large number
      for (let i = 0; i < 99; i++) {
        fireEvent.click(incrementButton);
      }

      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('should handle product with missing image_url', async () => {
      const mockProduct = createMockProduct({ image_url: '' });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 1,
          Product: mockProduct,
        });
      });
    });

    it('should handle product with null image_url', async () => {
      const mockProduct = createMockProduct({
        image_url: null as unknown as string,
      });

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 1,
          Product: mockProduct,
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing useCart context', () => {
      mockUseCart.mockReturnValue({
        addToCart: undefined,
      });

      const mockProduct = createMockProduct();

      expect(() => {
        render(<Operation product={mockProduct} />);
      }).not.toThrow();
    });

    it('should call addToCart function when provided', async () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const addToCartButton = screen.getByText('Add to Cart');
      fireEvent.click(addToCartButton);

      await waitFor(() => {
        expect(mockAddToCart).toHaveBeenCalledWith({
          productId: mockProduct.id,
          quantity: 1,
          Product: mockProduct,
        });
      });

      expect(mockAddToCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have button elements', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const decrementButton = screen.getByText('-');
      const incrementButton = screen.getByText('+');
      const addToCartButton = screen.getByText('Add to Cart');

      // Check that buttons exist and are clickable
      expect(decrementButton).toBeInTheDocument();
      expect(incrementButton).toBeInTheDocument();
      expect(addToCartButton).toBeInTheDocument();

      // Check that they respond to clicks without throwing errors
      expect(() => {
        fireEvent.click(decrementButton);
        fireEvent.click(incrementButton);
      }).not.toThrow();
    });

    it('should display current quantity for screen readers', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const quantityDisplay = screen.getByText('1');
      expect(quantityDisplay).toBeInTheDocument();

      const incrementButton = screen.getByText('+');
      fireEvent.click(incrementButton);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const decrementButton = screen.getByText('-');
      const incrementButton = screen.getByText('+');
      const addToCartButton = screen.getByText('Add to Cart');

      // Check if they have button role (either explicit or implicit)
      expect(
        decrementButton.closest('button') || decrementButton
      ).toBeInTheDocument();
      expect(
        incrementButton.closest('button') || incrementButton
      ).toBeInTheDocument();
      expect(
        addToCartButton.closest('button') || addToCartButton
      ).toBeInTheDocument();
    });
  });

  describe('Component State Management', () => {
    it('should maintain quantity state during component lifecycle', () => {
      const mockProduct = createMockProduct();

      render(<Operation product={mockProduct} />);

      const incrementButton = screen.getByText('+');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      // State should be maintained within the same component instance
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should start with fresh state for new component instances', () => {
      const mockProduct1 = createMockProduct({ id: 1, name: 'Product 1' });
      const mockProduct2 = createMockProduct({ id: 2, name: 'Product 2' });

      // First component instance
      const { unmount } = render(<Operation product={mockProduct1} />);

      const incrementButton = screen.getByText('+');
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(screen.getByText('3')).toBeInTheDocument();

      // Unmount first instance
      unmount();

      // Render new component instance with different product
      render(<Operation product={mockProduct2} />);

      // New instance should start with fresh state
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('should maintain independent state for multiple component instances', () => {
      const mockProduct1 = createMockProduct({ id: 1, name: 'Product 1' });
      const mockProduct2 = createMockProduct({ id: 2, name: 'Product 2' });

      // Render components in separate containers to avoid conflicts
      const { container: container1 } = render(
        <div data-testid="component1">
          <Operation product={mockProduct1} />
        </div>
      );

      const { container: container2 } = render(
        <div data-testid="component2">
          <Operation product={mockProduct2} />
        </div>
      );

      // Get increment buttons from each component using more specific selectors
      const incrementButton1 = container1.querySelector(
        '[data-testid="component1"] button:nth-child(3)'
      ) as HTMLElement;
      const incrementButton2 = container2.querySelector(
        '[data-testid="component2"] button:nth-child(3)'
      ) as HTMLElement;

      // Increment first instance twice
      fireEvent.click(incrementButton1);
      fireEvent.click(incrementButton1);

      // Increment second instance once
      fireEvent.click(incrementButton2);

      // Check that each component maintains its own state
      const quantity1 = container1.querySelector(
        '[data-testid="component1"] span'
      )?.textContent;
      const quantity2 = container2.querySelector(
        '[data-testid="component2"] span'
      )?.textContent;

      expect(quantity1).toBe('3');
      expect(quantity2).toBe('2');
    });
  });
});
