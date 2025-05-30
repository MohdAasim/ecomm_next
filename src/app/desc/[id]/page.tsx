import { getProductById } from "@/zserver/services/productService";
import ProductDesc from "./ProductDesc";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const product = await getProductById(params.id);

  // Convert to plain object if needed (Sequelize instance)
  const plainProduct =
    typeof product.toJSON === "function" ? product.toJSON() : product;

  return <ProductDesc product={plainProduct} />;
}
