import ProductDesc from "./ProductDesc";

type Param = {
  params: Promise<{ id: string }>;
};
const Page = async ({ params }: Param) => {
  const { id } = await params;

  return <ProductDesc id={id} />;
};

export default Page;
