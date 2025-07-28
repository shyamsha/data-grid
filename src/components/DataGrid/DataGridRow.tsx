"use client";

import React from "react";
import { motion } from "framer-motion";
import { Column } from "../../types/grid.types";
import { DataGridCell } from "./DataGridCell";

interface DataGridRowProps {
  row: any;
  columns: Column[];
  isSelected: boolean;
  onRowSelect: (id: string) => void;
  density: "compact" | "standard" | "comfortable";
  index: number;
}

export const DataGridRow: React.FC<DataGridRowProps> = ({
  row,
  columns,
  isSelected,
  onRowSelect,
  density,
  index,
}) => {
  const getRowHeight = () => {
    switch (density) {
      case "compact":
        return 32;
      case "comfortable":
        return 56;
      default:
        return 44;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.01 }}
      className={`
        flex border-b border-gray-200 dark:border-gray-700
        ${
          isSelected
            ? "bg-blue-50 dark:bg-blue-900/20"
            : "hover:bg-gray-50 dark:hover:bg-gray-700"
        }
      `}
      style={{ height: getRowHeight() }}
      onClick={() => onRowSelect(String(row.id))}
    >
      {/* Selection checkbox */}
      <div className="flex items-center justify-center w-12 px-2 border-r border-gray-200 dark:border-gray-700">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onRowSelect(String(row.id))}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Data cells */}
      {columns.map((column) => (
        <DataGridCell
          key={column.field}
          params={{
            value: row[column.field],
            row,
            field: column.field,
            colDef: column,
          }}
          isSelected={isSelected}
          density={density}
        />
      ))}
    </motion.div>
  );
};
