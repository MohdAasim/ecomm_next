import { render, screen } from '@testing-library/react';
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

    const image = screen.getByAltText('product-img') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toBe(mockProduct.image_url);

    expect(screen.getByText('Test Product')).toBeInTheDocument();

    expect(screen.getByText('₹999')).toBeInTheDocument();

    expect(screen.getByText(/Category: Electronics/i)).toBeInTheDocument();
  });
});
