"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Column } from "../../types/grid.types";
import { useDataGrid } from "../../contexts/DataGridContext";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  columns,
}) => {
  const { state, dispatch } = useDataGrid();
  const [tempFilters, setTempFilters] = useState(state.filterModel);

  const operatorOptions = {
    string: [
      { value: "contains", label: "Contains" },
      { value: "equals", label: "Equals" },
      { value: "startsWith", label: "Starts with" },
      { value: "endsWith", label: "Ends with" },
    ],
    number: [
      { value: "equals", label: "Equals" },
      { value: "gt", label: "Greater than" },
      { value: "lt", label: "Less than" },
      { value: "gte", label: "Greater than or equal" },
      { value: "lte", label: "Less than or equal" },
    ],
  };

  const handleFilterChange = (
    field: string,
    value: string,
    operator: string
  ) => {
    setTempFilters((prev) => {
      return {
        ...prev,
        [field]: {
          value,
          operator: operator as
            | "contains"
            | "equals"
            | "startsWith"
            | "endsWith"
            | "gt"
            | "lt"
            | "gte"
            | "lte",
        },
      };
    });
  };

  const applyFilters = () => {
    Object.entries(tempFilters).forEach(([field, filter]) => {
      dispatch({
        type: "SET_FILTER",
        payload: { field, value: filter.value, operator: filter.operator },
      });
    });
    onClose();
  };

  const clearFilters = () => {
    setTempFilters({});
    Object.keys(state.filterModel).forEach((field) => {
      dispatch({
        type: "SET_FILTER",
        payload: { field, value: "", operator: "contains" },
      });
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {columns
              .filter((col) => col.filterable !== false)
              .map((column) => {
                const filter = tempFilters[column.field] || {
                  value: "",
                  operator: "contains",
                };
                const getOperators = (type: string) => {
                  if (type === "string" || type === "number") {
                    return operatorOptions[type];
                  }
                  return operatorOptions.string;
                };
                const operators = getOperators(column.type || "string");

                return (
                  <div key={column.field} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {column.headerName}
                    </label>

                    <Select
                      value={filter.operator}
                      onChange={(e) =>
                        handleFilterChange(
                          column.field,
                          filter.value,
                          e.target.value
                        )
                      }
                      options={operators}
                    />

                    <Input
                      value={filter.value}
                      onChange={(e) =>
                        handleFilterChange(
                          column.field,
                          e.target.value,
                          filter.operator
                        )
                      }
                      placeholder={`Filter ${column.headerName}`}
                    />
                  </div>
                );
              })}

            <div className="flex space-x-2 pt-4">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
