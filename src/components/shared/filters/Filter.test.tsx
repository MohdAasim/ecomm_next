import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './Filter';
import { CATEGORY_FILTER } from '../../../utils/constants';

describe('Filter component', () => {
  const mockProps = {
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

  it('renders category dropdown and price inputs', () => {
    render(<Filter {...mockProps} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument();
  });

  it('renders correct category options', () => {
    render(<Filter {...mockProps} />);

    CATEGORY_FILTER.forEach((cat) => {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
    });
  });

  it('calls onCategoryChange when category is changed', () => {
    render(<Filter {...mockProps} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'electronics' },
    });

    expect(mockProps.onCategoryChange).toHaveBeenCalledWith('electronics');
  });

  it('calls onMinPriceChange when min price is changed', () => {
    render(<Filter {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText('Min Price'), {
      target: { value: '100' },
    });

    expect(mockProps.onMinPriceChange).toHaveBeenCalledWith(100);
  });

  it('calls onMaxPriceChange when max price is changed', () => {
    render(<Filter {...mockProps} />);

    fireEvent.change(screen.getByPlaceholderText('Max Price'), {
      target: { value: '500' },
    });

    expect(mockProps.onMaxPriceChange).toHaveBeenCalledWith(500);
  });

  it('calls price change handlers with undefined when inputs are cleared', () => {
    render(<Filter {...mockProps} minPrice={100} maxPrice={500} />);

    const minPriceInput = screen.getByPlaceholderText('Min Price');
    const maxPriceInput = screen.getByPlaceholderText('Max Price');

    fireEvent.change(minPriceInput, { target: { value: '' } });
    fireEvent.change(maxPriceInput, { target: { value: '' } });

    expect(mockProps.onMinPriceChange).toHaveBeenCalledWith(undefined);
    expect(mockProps.onMaxPriceChange).toHaveBeenCalledWith(undefined);
  });
});
