import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage component', () => {
  it('renders with default message when no message is provided', () => {
    render(<ErrorMessage />);
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('renders with a custom message when provided', () => {
    const customMessage = 'Failed to fetch data';
    render(<ErrorMessage message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('has the correct class name for styling', () => {
    render(<ErrorMessage message="Network error" />);
    const element = screen.getByText('Network error');
    expect(element).toHaveClass('error-message');
  });
});
