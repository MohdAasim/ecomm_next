import React from 'react';
import type { Product } from '../../../types/Product';
import './Itemcard.css';
import Image from 'next/image';

interface ItemCardProps {
  data: Product;
}

const ItemCard: React.FC<ItemCardProps> = ({ data }) => {
  // Provide a fallback image URL
  const imageUrl = data.image_url;

  return (
    <article className="card">
      <Image
        className="img_card"
        alt={data.name}
        src={imageUrl as string}
        width={200}
        height={200}
        priority
      />
      <h2>{data.name}</h2>
      <p>₹{data.price}</p>
      <p>Category: {data.category}</p>
    </article>
  );
};

export default ItemCard;
