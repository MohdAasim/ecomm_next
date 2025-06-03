import { getProductById } from "@/zserver/actions/productService";
import ErrorMessage from "@/components/shared/errorMessage/ErrorMessage";
import Image from "next/image";
import Operation from "@/components/Product/Operation";
import "./ProductDesc.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  // Convert to plain object if needed (Sequelize instance)
  const plainProduct =
    typeof product.toJSON === "function" ? product.toJSON() : product;

  if (!product) {
    return <ErrorMessage message="Failed to load product" />;
  }

  return (
    <div className="product-container">
      <div className="product-card">
        <Image
          src={product.image_url || "/placeholder.png"}
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
