"use client";
import React, { useCallback, useMemo, useState } from "react";
import ItemCard from "@/components/shared/itemCard/ItemCard";
import { useProducts } from "@/hooks/useProducts";
import ShimmerUi from "@/components/ShimmerUi";
import Pagination from "@/components/shared/pagination/Pagination";
import ErrorMessage from "@/components/shared/errorMessage/ErrorMessage";
import SearchBar from "@/components/shared/searchBar/SearchBar";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import Filter from "@/components/shared/filters/Filter";
import "./ProductListing.css";
import Link from "next/link";

const ProductListing: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const filters = useMemo(
    () => ({
      page,
      search: query,
      category,
      minPrice,
      maxPrice,
    }),
    [page, query, category, minPrice, maxPrice],
  );

  const { items, currentPage, totalPages, loading, error } =
    useProducts(filters);

  const handleSearch = useCallback(() => {
    let changed = false;

    setQuery((prevQuery) => {
      if (prevQuery !== searchTerm) {
        changed = true;
        return searchTerm;
      }
      return prevQuery;
    });

    setPage((prevPage) => {
      if (changed && prevPage !== 1) return 1;
      return prevPage;
    });
  }, [searchTerm]);

  useDebouncedEffect(
    () => {
      if (searchTerm.trim() === "") {
        handleSearch();
      }
    },
    [searchTerm],
    300,
  );

  return (
    <div className="container">
      <div className="top-controls">
        <SearchBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={handleSearch}
        />
        <Filter
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onCategoryChange={setCategory}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />
      </div>
      {loading ? (
        <div className="products-grid">
          <ShimmerUi />
        </div>
      ) : error ? (
        <ErrorMessage message="Failed to load products" />
      ) : items.length === 0 ? (
        <ErrorMessage message="No products found." />
      ) : (
        <>
          <div className="products-grid">
            {items.map((item) => (
              <Link href={"/desc/" + item.id} key={item.id}>
                <ItemCard data={item} />
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductListing;
