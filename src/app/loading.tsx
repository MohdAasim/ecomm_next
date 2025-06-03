import ShimmerUi from "@/components/ShimmerUi";
import "./ProductListing.css";

const loading = () => {
  return (
    <div className="container">
      <div className="products-grid">
        <ShimmerUi />
      </div>
    </div>
  );
};

export default loading;
