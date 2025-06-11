import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemCard from './ItemCard';
import type { Product } from '../../../types/Product';

describe('ItemCard component', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    price: 999,
    category: 'Electronics',
    description: 'Test description',
    image_url: 'https://example.com/image.jpg',
  };

  it('renders product image, name, price, and category', () => {
    render(<ItemCard data={mockProduct} />);

    const image = screen.getByAltText('Test Product') as HTMLImageElement;
    expect(image).toBeInTheDocument();

    // Use non-null assertion since we know it's defined in our test
    expect(image.src).toContain(encodeURIComponent(mockProduct.image_url!));

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
    expect(screen.getByText(/Category: Electronics/i)).toBeInTheDocument();
  });

  it('renders with different product data', () => {
    const anotherProduct: Product = {
      id: 2,
      name: 'Another Product',
      price: 1599,
      category: 'Books',
      description: 'Another description',
      image_url: 'https://example.com/another-image.jpg',
    };

    render(<ItemCard data={anotherProduct} />);

    expect(screen.getByAltText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
    expect(screen.getByText('₹1599')).toBeInTheDocument();
    expect(screen.getByText(/Category: Books/i)).toBeInTheDocument();
  });

  it('renders article with correct class', () => {
    const { container } = render(<ItemCard data={mockProduct} />);

    expect(container.firstChild).toHaveClass('card');
  });

  it('renders image with correct attributes', () => {
    render(<ItemCard data={mockProduct} />);

    const image = screen.getByAltText('Test Product') as HTMLImageElement;
    expect(image).toHaveAttribute('width', '200');
    expect(image).toHaveAttribute('height', '200');
    expect(image).toHaveClass('img_card');
  });

  it('renders product name as heading', () => {
    render(<ItemCard data={mockProduct} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Test Product');
  });

  it('formats price with rupee symbol', () => {
    const productWithDifferentPrice: Product = {
      ...mockProduct,
      price: 1234,
    };

    render(<ItemCard data={productWithDifferentPrice} />);

    expect(screen.getByText('₹1234')).toBeInTheDocument();
  });

  it('handles product with no image gracefully', () => {
    const productWithoutImage: Product = {
      ...mockProduct,
      image_url: '',
    };

    render(<ItemCard data={productWithoutImage} />);

    // The component should still render other elements
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
  });
});
