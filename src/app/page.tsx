import { getProducts } from '@/server/actions/productService';
import ProductListingClient from './ProductListingClient';
import { Product } from '@/types/Product';
import Link from 'next/link';
import ItemCard from '@/components/shared/itemCard/ItemCard';
import ErrorMessage from '@/components/shared/errorMessage/ErrorMessage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Ecommerce App',
  description: 'Browse our wide selection of quality products at great prices',
  keywords: ['ecommerce', 'shopping', 'products', 'online store'],
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function ProductListing({ searchParams }: PageProps) {
  const searchParam = await searchParams;
  const page = Number(searchParam.page) || 1;
  const search = searchParam?.search || '';
  const category = searchParam?.category || '';
  const minPrice = searchParam?.minPrice
    ? Number(searchParam.minPrice)
    : undefined;
  const maxPrice = searchParam?.maxPrice
    ? Number(searchParam.maxPrice)
    : undefined;

  const { products, currentPage, totalPages } = await getProducts({
    page,
    search,
    category,
    minPrice,
    maxPrice,
  });

  // Convert Sequelize instances to plain objects
  const plainProducts = products.map(
    (p: Product & { toJSON?: () => Product }) =>
      typeof p.toJSON === 'function' ? p.toJSON() : p
  );

  return (
    <ProductListingClient
      products={plainProducts}
      currentPage={currentPage}
      totalPages={totalPages}
      search={search}
      category={category}
      minPrice={minPrice}
      maxPrice={maxPrice}
    >
      {products.length === 0 ? (
        <div>
          <ErrorMessage message={'No Product Found'} />{' '}
        </div>
      ) : (
        <>
          <main className="products-grid">
            {products.map((item: Product) => (
              <Link href={'/desc/' + item.id} key={item.id}>
                <ItemCard data={item} />
              </Link>
            ))}
          </main>
        </>
      )}
    </ProductListingClient>
  );
}
