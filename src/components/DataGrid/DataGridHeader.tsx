"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Column, SortModel } from "../../types/grid.types";
import { useDataGrid } from "../../contexts/DataGridContext";

interface DataGridHeaderProps {
  column: Column;
  sortModel: SortModel[];
  onSort: (field: string) => void;
  onResize: (field: string, width: number) => void;
}

export const DataGridHeader: React.FC<DataGridHeaderProps> = ({
  column,
  sortModel,
  onSort,
  onResize,
}) => {
  const { dispatch } = useDataGrid();
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(column.width);

  const sortDirection = sortModel.find((s) => s.field === column.field)?.sort;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setDragStartX(e.clientX);
    setInitialWidth(column.width);
    e.preventDefault();
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - dragStartX;
      const newWidth = Math.max(50, initialWidth + deltaX);
      onResize(column.field, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, dragStartX, initialWidth, column.field, onResize]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <motion.div
      className="relative flex items-center justify-between bg-gray-50 dark:bg-gray-700 border-r border-b border-gray-200 dark:border-gray-600 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
      style={{ width: column.width }}
      onContextMenu={handleContextMenu}
    >
      <div
        className="flex items-center space-x-1 cursor-pointer flex-1"
        onClick={() => column.sortable && onSort(column.field)}
      >
        <span className="truncate">{column.headerName}</span>
        {column.sortable && sortDirection && (
          <span className="text-blue-500">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </div>

      {column.resizable !== false && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 bg-transparent"
          onMouseDown={handleMouseDown}
        />
      )}
    </motion.div>
  );
};
