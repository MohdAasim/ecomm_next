import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('SearchBar component', () => {
  const mockOnSearchTermChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and button correctly', () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchTermChange={mockOnSearchTermChange}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearchTermChange when typing', () => {
    render(
      <SearchBar
        searchTerm=""
        onSearchTermChange={mockOnSearchTermChange}
        onSearch={mockOnSearch}
      />
    );

    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: 'laptop' } });

    expect(mockOnSearchTermChange).toHaveBeenCalledWith('laptop');
  });

  it('calls onSearch when clicking the search button', () => {
    render(
      <SearchBar
        searchTerm="laptop"
        onSearchTermChange={mockOnSearchTermChange}
        onSearch={mockOnSearch}
      />
    );

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
});
