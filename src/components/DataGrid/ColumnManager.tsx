"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Column } from "../../types/grid.types";
import { useDataGrid } from "../../contexts/DataGridContext";
import { Button } from "../ui/Button";

interface ColumnManagerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({
  isOpen,
  onClose,
  columns,
}) => {
  const { state, dispatch } = useDataGrid();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleColumnToggle = (field: string) => {
    dispatch({ type: "TOGGLE_COLUMN_VISIBILITY", payload: field });
  };

  const handlePinColumn = (field: string, side: "left" | "right" | null) => {
    dispatch({ type: "PIN_COLUMN", payload: { field, side } });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      dispatch({
        type: "REORDER_COLUMNS",
        payload: { from: draggedIndex, to: targetIndex },
      });
    }
    setDraggedIndex(null);
  };

  const isColumnPinned = (field: string) => {
    if (state.pinnedColumns.left.includes(field)) return "left";
    if (state.pinnedColumns.right.includes(field)) return "right";
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Manage Columns
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            </div>
          </div>

          <div className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Drag columns to reorder, toggle visibility, or pin columns.
            </p>

            <div className="space-y-2">
              {columns.map((column, index) => {
                const isVisible = state.visibleColumns.includes(column.field);
                const pinnedSide = isColumnPinned(column.field);

                return (
                  <motion.div
                    key={column.field}
                    layout
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    className={`
                      p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-move
                      ${draggedIndex === index ? "opacity-50" : ""}
                      hover:bg-gray-50 dark:hover:bg-gray-700
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 flex items-center justify-center text-gray-400">
                          ⋮⋮
                        </div>
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => handleColumnToggle(column.field)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {column.headerName}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant={pinnedSide === "left" ? "primary" : "ghost"}
                          size="sm"
                          onClick={() =>
                            handlePinColumn(
                              column.field,
                              pinnedSide === "left" ? null : "left"
                            )
                          }
                          title="Pin to left"
                        >
                          📌L
                        </Button>
                        <Button
                          variant={pinnedSide === "right" ? "primary" : "ghost"}
                          size="sm"
                          onClick={() =>
                            handlePinColumn(
                              column.field,
                              pinnedSide === "right" ? null : "right"
                            )
                          }
                          title="Pin to right"
                        >
                          📌R
                        </Button>
                      </div>
                    </div>

                    {pinnedSide && (
                      <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                        Pinned to {pinnedSide}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
