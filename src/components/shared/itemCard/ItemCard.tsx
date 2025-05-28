import React from "react";
import type { Product } from "../../../types/Product";
import "./Itemcard.css";

interface ItemCardProps {
  data: Product;
}

const ItemCard: React.FC<ItemCardProps> = ({ data }) => {
  return (
    <div className="card">
      <img className="img_card" alt="product-img" src={data.image_url} />
      <h2>{data.name}</h2>
      <p>₹{data.price}</p>
      <p>Category: {data.category}</p>
    </div>
  );
};

export default ItemCard;
