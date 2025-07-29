"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useDataGrid } from "../../contexts/DataGridContext";
import { useApi } from "../../hooks/useApi";
import { Column, User } from "../../types/grid.types";
import { DataGridToolbar } from "./DataGridToolbar";
import { DataGridHeader } from "./DataGridHeader";
import { DataGridRow } from "./DataGridRow";
import { Pagination } from "./Pagination";
import { FilterPanel } from "./FilterPanel";
import { ColumnManager } from "./ColumnManager";
import { Button } from "../ui/Button";

const defaultColumns: Column[] = [
  { field: "id", headerName: "ID", width: 80, type: "number" },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    sortable: true,
    filterable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    sortable: true,
    filterable: true,
  },
  {
    field: "role",
    headerName: "Role",
    width: 120,
    sortable: true,
    filterable: true,
    type: "select",
  },
  {
    field: "department",
    headerName: "Department",
    width: 130,
    sortable: true,
    filterable: true,
  },
  {
    field: "salary",
    headerName: "Salary",
    width: 120,
    type: "number",
    sortable: true,
    filterable: true,
    renderCell: (params) => `${params.value.toLocaleString()}`,
  },
  {
    field: "joinDate",
    headerName: "Join Date",
    width: 120,
    type: "date",
    sortable: true,
    filterable: true,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          params.value === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 100,
    sortable: false,
    filterable: false,
    type: "actions",
    renderCell: (params) => (
      <div className="flex items-center space-x-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => console.log("View", params.row)}
        >
          <svg
            className="w-[18px] h-[18px] text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M4.998 7.78C6.729 6.345 9.198 5 12 5c2.802 0 5.27 1.345 7.002 2.78a12.713 12.713 0 0 1 2.096 2.183c.253.344.465.682.618.997.14.286.284.658.284 1.04s-.145.754-.284 1.04a6.6 6.6 0 0 1-.618.997 12.712 12.712 0 0 1-2.096 2.183C17.271 17.655 14.802 19 12 19c-2.802 0-5.27-1.345-7.002-2.78a12.712 12.712 0 0 1-2.096-2.183 6.6 6.6 0 0 1-.618-.997C2.144 12.754 2 12.382 2 12s.145-.754.284-1.04c.153-.315.365-.653.618-.997A12.714 12.714 0 0 1 4.998 7.78ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clip-rule="evenodd"
            />
          </svg>
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => console.log("Delete", params.row)}
        >
          <span>&#9747;</span>
        </Button>
      </div>
    ),
  },
];

export const DataGrid: React.FC = () => {
  const { state, dispatch } = useDataGrid();
  const { fetchData, loading, error } = useApi();
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_COLUMNS", payload: defaultColumns });

      try {
        const response = await fetchData({ pageSize: 1000 });
        dispatch({ type: "SET_DATA", payload: response.data });
        dispatch({
          type: "SET_PAGINATION",
          payload: { total: response.total },
        });
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load data" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadData();
  }, [dispatch, fetchData]);

  const visibleColumns = useMemo(() => {
    return state.columns.filter((col) =>
      state.visibleColumns.includes(col.field)
    );
  }, [state.columns, state.visibleColumns]);

  const paginatedData = useMemo(() => {
    const start = (state.pagination.page - 1) * state.pagination.pageSize;
    const end = start + state.pagination.pageSize;
    return state.filteredData.slice(start, end);
  }, [state.filteredData, state.pagination.page, state.pagination.pageSize]);

  const handleSort = (field: string) => {
    const existingSort = state.sortModel.find((s) => s.field === field);
    let newSortModel: any[];

    if (!existingSort) {
      newSortModel = [{ field, sort: "asc" as const }];
    } else if (existingSort.sort === "asc") {
      newSortModel = [{ field, sort: "desc" as const }];
    } else {
      newSortModel = [];
    }

    dispatch({ type: "SET_SORT", payload: newSortModel });
  };

  const handleResize = (field: string, width: number) => {
    dispatch({ type: "RESIZE_COLUMN", payload: { field, width } });
  };

  const handleRowSelect = (id: string) => {
    dispatch({ type: "SELECT_ROW", payload: id });
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((row) => String(row.id));
    const allSelected = currentPageIds.every((id) =>
      state.selectedRows.has(id)
    );
    dispatch({ type: "SELECT_ALL_ROWS", payload: !allSelected });
  };

  if (state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{state.error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <DataGridToolbar
        onToggleColumnManager={() => setShowColumnManager(!showColumnManager)}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="flex-1 overflow-hidden relative">
        {/* Column Manager */}
        <ColumnManager
          isOpen={showColumnManager}
          onClose={() => setShowColumnManager(false)}
          columns={state.columns}
        />

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          columns={state.columns}
        />

        {/* Main Grid */}
        <div className="h-full overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 flex bg-gray-50 dark:bg-gray-700">
            {/* Select All Checkbox */}
            <div className="flex items-center justify-center w-12 px-2 border-r border-gray-200 dark:border-gray-600">
              <input
                type="checkbox"
                checked={
                  paginatedData.length > 0 &&
                  paginatedData.every((row) =>
                    state.selectedRows.has(String(row.id))
                  )
                }
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            {/* Column Headers */}
            {visibleColumns.map((column) => (
              <DataGridHeader
                key={column.field}
                column={column}
                sortModel={state.sortModel}
                onSort={handleSort}
                onResize={handleResize}
              />
            ))}
          </div>

          {/* Rows */}
          <div>
            {paginatedData.map((row, index) => (
              <DataGridRow
                key={row.id}
                row={row}
                columns={visibleColumns}
                isSelected={state.selectedRows.has(String(row.id))}
                onRowSelect={handleRowSelect}
                density={state.density}
                index={index}
              />
            ))}
          </div>

          {paginatedData.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <p className="text-gray-500 dark:text-gray-400">
                No data found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      <Pagination />
    </div>
  );
};
