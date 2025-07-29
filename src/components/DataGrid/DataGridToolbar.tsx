"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useDataGrid } from "../../contexts/DataGridContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { exportToCSV, exportToJSON } from "../../utils/gridHelpers";

interface DataGridToolbarProps {
  onToggleColumnManager: () => void;
  onToggleFilters: () => void;
}

export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
  onToggleColumnManager,
  onToggleFilters,
}) => {
  const { state, dispatch } = useDataGrid();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState(state.searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    dispatch({ type: "SET_SEARCH", payload: query });
  };

  const handleDensityChange = (
    density: "compact" | "standard" | "comfortable"
  ) => {
    dispatch({ type: "SET_DENSITY", payload: density });
  };

  const handleExport = (format: "csv" | "json") => {
    const visibleColumns = state.columns.filter((col) =>
      state.visibleColumns.includes(col.field)
    );

    if (format === "csv") {
      exportToCSV(state.filteredData, visibleColumns);
    } else {
      exportToJSON(state.filteredData);
    }
  };

  const handleBulkAction = (action: string) => {
    const selectedIds = Array.from(state.selectedRows);
    console.log(`Bulk action: ${action} on items:`, selectedIds);
    // Implement bulk action logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Data Grid
        </h2>

        <div className="flex items-center space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search across all columns..."
            className="w-64"
          />

          <Button variant="ghost" onClick={onToggleFilters}>
            Filters
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {state.selectedRows.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {state.selectedRows.size} selected
            </span>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleBulkAction("delete")}
            >
              Delete Selected
            </Button>
          </div>
        )}

        <Select
          value={state.density}
          onChange={(e) => handleDensityChange(e.target.value as any)}
          options={[
            { value: "compact", label: "Compact" },
            { value: "standard", label: "Standard" },
            { value: "comfortable", label: "Comfortable" },
          ]}
        />

        <Button variant="ghost" onClick={onToggleColumnManager}>
          <span>&#9881; Columns</span>
        </Button>

        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleExport("csv")}>
            <span>&#128200; CSV</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExport("json")}
          >
            📄 JSON
          </Button>
        </div>

        <Button variant="ghost" onClick={toggleTheme}>
          {theme === "light" ? <span>&#9789;</span> : <span>&#9788;</span>}
        </Button>
      </div>
    </motion.div>
  );
};
