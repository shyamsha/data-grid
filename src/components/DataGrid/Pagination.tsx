"use client";

import React from "react";
import { motion } from "framer-motion";
import { useDataGrid } from "../../contexts/DataGridContext";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

export const Pagination: React.FC = () => {
  const { state, dispatch } = useDataGrid();
  const { pagination, filteredData } = state;

  const totalPages = Math.ceil(filteredData.length / pagination.pageSize);
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    filteredData.length
  );

  const handlePageChange = (newPage: number) => {
    dispatch({ type: "SET_PAGINATION", payload: { page: newPage } });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: {
        pageSize: newPageSize,
        page: 1,
      },
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const current = pagination.page;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startItem} to {endItem} of {filteredData.length} entries
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Rows per page:
          </span>
          <Select
            value={String(pagination.pageSize)}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            options={[
              { value: "10", label: "10" },
              { value: "25", label: "25" },
              { value: "50", label: "50" },
              { value: "100", label: "100" },
            ]}
            className="w-20"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={pagination.page === 1}
        >
          First
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </Button>

        <div className="flex space-x-1">
          {getPageNumbers().map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === pagination.page ? "primary" : "ghost"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="min-w-[40px]"
            >
              {pageNum}
            </Button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages}
        >
          Next
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={pagination.page === totalPages}
        >
          Last
        </Button>
      </div>
    </motion.div>
  );
};
