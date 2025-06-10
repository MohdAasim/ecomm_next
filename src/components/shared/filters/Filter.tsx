import React from 'react';
import { CATEGORY_FILTER } from '../../../utils/constants';
import './Filter.css';

interface FilterProps {
  category: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: number | undefined) => void;
  onMaxPriceChange: (value: number | undefined) => void;
}

const Filter: React.FC<FilterProps> = ({
  category,
  minPrice,
  maxPrice,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
}) => {
  return (
    <div className="filter-bar">
      <select
        className="bg-[var(--bg)]"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {CATEGORY_FILTER.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          onMinPriceChange(value ? Number(value) : undefined);
        }}
      />

      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          onMaxPriceChange(value ? Number(value) : undefined);
        }}
      />
    </div>
  );
};

export default React.memo(Filter);
