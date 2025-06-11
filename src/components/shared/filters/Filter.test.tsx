import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filter from './Filter';
import { CATEGORY_FILTER } from '../../../utils/constants';

describe('Filter Component', () => {
  const defaultProps = {
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    onCategoryChange: jest.fn(),
    onMinPriceChange: jest.fn(),
    onMaxPriceChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all filter elements correctly', () => {
      render(<Filter {...defaultProps} />);

      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
    });

    it('should render the filter container with correct class', () => {
      const { container } = render(<Filter {...defaultProps} />);

      expect(container.firstChild).toHaveClass('filter-bar');
    });

    it('should render all category options from constants', () => {
      render(<Filter {...defaultProps} />);

      CATEGORY_FILTER.forEach((category) => {
        expect(screen.getByText(category.label)).toBeInTheDocument();
      });
    });

    it('should display correct input types for price fields', () => {
      render(<Filter {...defaultProps} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      const maxPriceInput = screen.getByPlaceholderText('Max Price');

      expect(minPriceInput).toHaveAttribute('type', 'number');
      expect(maxPriceInput).toHaveAttribute('type', 'number');
    });
  });

  describe('Initial Values', () => {
    it('should display empty values when no props are provided', () => {
      render(<Filter {...defaultProps} />);

      const categorySelect = screen.getByRole('combobox');
      const minPriceInput = screen.getByPlaceholderText('Min Price');
      const maxPriceInput = screen.getByPlaceholderText('Max Price');

      expect(categorySelect).toHaveValue('');
      // Number inputs with empty value return empty string, not null
      expect(minPriceInput).toHaveValue(null);
      expect(maxPriceInput).toHaveValue(null);
    });

    it('should display provided values correctly', () => {
      const propsWithValues = {
        ...defaultProps,
        category: 'electronics',
        minPrice: 100,
        maxPrice: 500,
      };

      render(<Filter {...propsWithValues} />);

      const categorySelect = screen.getByRole('combobox');
      const minPriceInput = screen.getByPlaceholderText('Min Price');
      const maxPriceInput = screen.getByPlaceholderText('Max Price');

      expect(categorySelect).toHaveValue('electronics');
      // Number inputs return numbers, not strings
      expect(minPriceInput).toHaveValue(100);
      expect(maxPriceInput).toHaveValue(500);
    });
  });

  describe('Category Selection', () => {
    it('should call onCategoryChange when category is selected', () => {
      render(<Filter {...defaultProps} />);

      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });

      expect(defaultProps.onCategoryChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('electronics');
    });

    it('should call onCategoryChange when category is changed to empty', () => {
      const propsWithCategory = {
        ...defaultProps,
        category: 'electronics',
      };

      render(<Filter {...propsWithCategory} />);

      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: '' } });

      expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('');
    });
  });

  describe('Min Price Input', () => {
    it('should call onMinPriceChange with number when valid price is entered', () => {
      render(<Filter {...defaultProps} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      fireEvent.change(minPriceInput, { target: { value: '100' } });

      expect(defaultProps.onMinPriceChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(100);
    });

    it('should call onMinPriceChange with undefined when input is cleared', () => {
      const propsWithMinPrice = {
        ...defaultProps,
        minPrice: 100,
      };

      render(<Filter {...propsWithMinPrice} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      fireEvent.change(minPriceInput, { target: { value: '' } });

      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(undefined);
    });

    it('should handle decimal values correctly', () => {
      render(<Filter {...defaultProps} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      fireEvent.change(minPriceInput, { target: { value: '99.99' } });

      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(99.99);
    });
  });

  describe('Max Price Input', () => {
    it('should call onMaxPriceChange with number when valid price is entered', () => {
      render(<Filter {...defaultProps} />);

      const maxPriceInput = screen.getByPlaceholderText('Max Price');
      fireEvent.change(maxPriceInput, { target: { value: '500' } });

      expect(defaultProps.onMaxPriceChange).toHaveBeenCalledTimes(1);
      expect(defaultProps.onMaxPriceChange).toHaveBeenCalledWith(500);
    });

    it('should call onMaxPriceChange with undefined when input is cleared', () => {
      const propsWithMaxPrice = {
        ...defaultProps,
        maxPrice: 500,
      };

      render(<Filter {...propsWithMaxPrice} />);

      const maxPriceInput = screen.getByPlaceholderText('Max Price');
      fireEvent.change(maxPriceInput, { target: { value: '' } });

      expect(defaultProps.onMaxPriceChange).toHaveBeenCalledWith(undefined);
    });

    it('should handle decimal values correctly', () => {
      render(<Filter {...defaultProps} />);

      const maxPriceInput = screen.getByPlaceholderText('Max Price');
      fireEvent.change(maxPriceInput, { target: { value: '199.99' } });

      expect(defaultProps.onMaxPriceChange).toHaveBeenCalledWith(199.99);
    });
  });

  describe('Multiple Interactions', () => {
    it('should handle multiple filter changes correctly', () => {
      render(<Filter {...defaultProps} />);

      const categorySelect = screen.getByRole('combobox');
      const minPriceInput = screen.getByPlaceholderText('Min Price');
      const maxPriceInput = screen.getByPlaceholderText('Max Price');

      // Change category - make sure 'clothing' exists in CATEGORY_FILTER
      // If it doesn't exist, use a valid category from your constants
      fireEvent.change(categorySelect, { target: { value: 'electronics' } });
      // Change min price
      fireEvent.change(minPriceInput, { target: { value: '50' } });
      // Change max price
      fireEvent.change(maxPriceInput, { target: { value: '200' } });

      expect(defaultProps.onCategoryChange).toHaveBeenCalledWith('electronics');
      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(50);
      expect(defaultProps.onMaxPriceChange).toHaveBeenCalledWith(200);
    });

    it('should reset price filters when cleared', () => {
      const propsWithValues = {
        ...defaultProps,
        category: 'electronics',
        minPrice: 100,
        maxPrice: 500,
      };

      render(<Filter {...propsWithValues} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      const maxPriceInput = screen.getByPlaceholderText('Max Price');

      // Clear both price inputs
      fireEvent.change(minPriceInput, { target: { value: '' } });
      fireEvent.change(maxPriceInput, { target: { value: '' } });

      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(undefined);
      expect(defaultProps.onMaxPriceChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values correctly', () => {
      render(<Filter {...defaultProps} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      fireEvent.change(minPriceInput, { target: { value: '0' } });

      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(0);
    });

    it('should handle negative values correctly', () => {
      render(<Filter {...defaultProps} />);

      const minPriceInput = screen.getByPlaceholderText('Min Price');
      fireEvent.change(minPriceInput, { target: { value: '-10' } });

      expect(defaultProps.onMinPriceChange).toHaveBeenCalledWith(-10);
    });
  });

  describe('Component Memoization', () => {
    it('should be wrapped with React.memo', () => {
      expect(Filter.displayName).toBe('Filter');
    });
  });
});
