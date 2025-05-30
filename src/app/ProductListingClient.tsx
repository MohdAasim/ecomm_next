"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Filter from "@/components/shared/filters/Filter";
import Pagination from "@/components/shared/pagination/Pagination";
import SearchBar from "@/components/shared/searchBar/SearchBar";
import { Product } from "@/types/Product";
import "./ProductListing.css";

type Props = {
  products: Product[];
  currentPage: number;
  totalPages: number;
  search: string;
  category: string;
  minPrice?: number;
  maxPrice?: number;
  children: React.ReactNode;
};

export default function ProductListingClient({
  products,
  currentPage,
  totalPages,
  search,
  category,
  minPrice,
  children,
  maxPrice,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(search);

  const updateParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    router.push("?" + newParams.toString());
  };

  // Only trigger search when button is clicked and input is not empty
  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      updateParams({ search: searchInput, page: "1" });
    } else {
      updateParams({ search: undefined, page: "1" });
    }
  };

  // Automatically trigger search when input becomes empty
  useEffect(() => {
    if (searchInput === "") {
      updateParams({ search: undefined, page: "1" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <div className="container">
      <div className="top-controls">
        <SearchBar
          searchTerm={searchInput}
          onSearchTermChange={setSearchInput}
          onSearch={handleSearch}
        />
        <Filter
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={(value) =>
            updateParams({ category: value, page: "1" })
          }
          onMinPriceChange={(value) =>
            updateParams({ minPrice: value?.toString() || "", page: "1" })
          }
          onMaxPriceChange={(value) =>
            updateParams({ maxPrice: value?.toString() || "", page: "1" })
          }
        />
      </div>
      {children}
      {totalPages > 1 && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => updateParams({ page: newPage.toString() })}
        />
      )}
    </div>
  );
}
