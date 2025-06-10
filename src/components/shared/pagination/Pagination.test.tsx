import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

jest.mock('../../../utils/pagination', () => ({
  generatePages: jest.fn(() => [1, 2, 3]),
}));

describe('Pagination component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Prev and Next buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Prev button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Prev')).not.toBeDisabled();
  });

  it('calls onPageChange with correct page number when a number button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('1'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('3'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when Prev and Next are clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    fireEvent.click(screen.getByText('Prev'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Next'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });
});
