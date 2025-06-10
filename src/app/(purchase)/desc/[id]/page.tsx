import { getProductById, getProducts } from '@/server/actions/productService';
import ErrorMessage from '@/components/shared/errorMessage/ErrorMessage';
import Image from 'next/image';
import Operation from '@/components/Product/Operation';
import './ProductDesc.css';
import { Product } from '@/types/Product';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

//-------------------------------------

// request comes in, at most once every 60 seconds.
export const revalidate = 60;

// We'll prerender only the params from `generateStaticParams` at build time.
// If a request comes in for a path that hasn't been generated,
// Next.js will server-render the page on-demand.
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  const { products } = (await getProducts({})) as { products: Product[] };
  return products.map((post) => ({
    id: String(post.id),
  }));
}

//-------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  return {
    title: `${product.name} - Ecommerce App`,
    description: product.description,
    keywords: [product.category, product.name, 'ecommerce'],
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  // Convert to plain object if needed (Sequelize instance)
  const plainProduct =
    typeof product.toJSON === 'function' ? product.toJSON() : product;

  if (!product) {
    return <ErrorMessage message="Failed to load product" />;
  }

  return (
    <div className="product-container">
      <div className="product-card">
        <Image
          src={product.image_url}
          alt={product.name}
          className="product-image"
          width={300}
          height={300}
          priority
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>
            <strong>Price:</strong> ₹{product.price}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>{product.description}</p>
          <Operation product={plainProduct} />
        </div>
      </div>
    </div>
  );
}
