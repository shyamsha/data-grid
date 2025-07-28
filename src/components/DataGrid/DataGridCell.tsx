"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CellParams } from "../../types/grid.types";
import { useDataGrid } from "../../contexts/DataGridContext";
import { Input } from "../ui/Input";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface DataGridCellProps {
  params: CellParams;
  isSelected: boolean;
  density: "compact" | "standard" | "comfortable";
}

export const DataGridCell: React.FC<DataGridCellProps> = ({
  params,
  isSelected,
  density,
}) => {
  const { state, dispatch } = useDataGrid();
  const [editValue, setEditValue] = useState(params.value);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing =
    state.editingCell?.rowId === String(params.row.id) &&
    state.editingCell?.field === params.field;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (params.colDef.type !== "actions") {
      dispatch({
        type: "START_EDIT_CELL",
        payload: { rowId: String(params.row.id), field: params.field },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleSave = () => {
    // In a real app, you'd update the data source here
    dispatch({ type: "END_EDIT_CELL" });
  };

  const handleCancel = () => {
    setEditValue(params.value);
    dispatch({ type: "END_EDIT_CELL" });
  };

  const getPaddingClass = () => {
    switch (density) {
      case "compact":
        return "px-2 py-1";
      case "comfortable":
        return "px-4 py-3";
      default:
        return "px-3 py-2";
    }
  };

  const renderCellContent = () => {
    if (isEditing) {
      return (
        <Input
          //@ts-ignore
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="text-xs"
        />
      );
    }

    if (params.colDef.renderCell) {
      return params.colDef.renderCell(params);
    }

    // Format value based on column type
    switch (params.colDef.type) {
      case "number":
        return typeof params.value === "number"
          ? params.value.toLocaleString()
          : params.value;
      case "date":
        return params.value ? new Date(params.value).toLocaleDateString() : "";
      default:
        return params.value;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        ${getPaddingClass()}
        text-sm
        border-r border-gray-200 dark:border-gray-700
        ${
          isSelected
            ? "bg-blue-50 dark:bg-blue-900/20"
            : "bg-white dark:bg-gray-800"
        }
        hover:bg-gray-50 dark:hover:bg-gray-700
        cursor-pointer
        flex items-center
        min-h-0
      `}
      onDoubleClick={handleDoubleClick}
      style={{ width: params.colDef.width }}
    >
      <div className="truncate w-full">{renderCellContent()}</div>
    </motion.div>
  );
};
