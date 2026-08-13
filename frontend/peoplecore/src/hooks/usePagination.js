import { useState, useMemo } from "react";
import { ITEMS_PER_PAGE } from "../utils/constants";

export const usePagination = (items = [], itemsPerPage = ITEMS_PER_PAGE) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage) || 1;
  }, [items.length, itemsPerPage]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    goToNext,
    goToPrev,
    resetPage,
    totalItems: items.length,
  };
};

export default usePagination;
