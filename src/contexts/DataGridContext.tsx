"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  GridState,
  GridAction,
  Column,
  SortModel,
  FilterModel,
} from "../types/grid.types";
import { sortData, filterData } from "../utils/gridHelpers";

const initialState: GridState = {
  data: [],
  filteredData: [],
  columns: [],
  visibleColumns: [],
  pinnedColumns: { left: [], right: [] },
  sortModel: [],
  filterModel: {},
  selectedRows: new Set(),
  pagination: { page: 1, pageSize: 25, total: 0 },
  loading: false,
  error: null,
  searchQuery: "",
  density: "standard",
  editingCell: null,
};

const gridReducer = (state: GridState, action: GridAction): GridState => {
  switch (action.type) {
    case "SET_DATA":
      const filteredData = filterData(
        action.payload,
        state.filterModel,
        state.searchQuery
      );
      const sortedAndFiltered = sortData(filteredData, state.sortModel);
      return {
        ...state,
        data: action.payload,
        filteredData: sortedAndFiltered,
      };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };

    case "SET_COLUMNS":
      return {
        ...state,
        columns: action.payload,
        visibleColumns: action.payload
          .filter((col) => col.visible !== false)
          .map((col) => col.field),
      };

    case "TOGGLE_COLUMN_VISIBILITY":
      const newVisibleColumns = state.visibleColumns.includes(action.payload)
        ? state.visibleColumns.filter((field) => field !== action.payload)
        : [...state.visibleColumns, action.payload];
      return { ...state, visibleColumns: newVisibleColumns };

    case "REORDER_COLUMNS":
      const newColumns = [...state.columns];
      const [movedColumn] = newColumns.splice(action.payload.from, 1);
      newColumns.splice(action.payload.to, 0, movedColumn);
      return { ...state, columns: newColumns };

    case "RESIZE_COLUMN":
      const updatedColumns = state.columns.map((col) =>
        col.field === action.payload.field
          ? { ...col, width: action.payload.width }
          : col
      );
      return { ...state, columns: updatedColumns };

    case "SET_SORT":
      const sortedData = sortData(state.filteredData, action.payload);
      return {
        ...state,
        sortModel: action.payload,
        filteredData: sortedData,
      };

    case "SET_FILTER":
      const newFilterModel = {
        ...state.filterModel,
        [action.payload.field]: {
          value: action.payload.value,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          operator: action.payload.operator as any,
        },
      };
      const newFilteredData = filterData(
        state.data,
        newFilterModel,
        state.searchQuery
      );
      const newSortedData = sortData(newFilteredData, state.sortModel);
      return {
        ...state,
        filterModel: newFilterModel,
        filteredData: newSortedData,
      };

    case "SET_SEARCH":
      const searchFilteredData = filterData(
        state.data,
        state.filterModel,
        action.payload
      );
      const searchSortedData = sortData(searchFilteredData, state.sortModel);
      return {
        ...state,
        searchQuery: action.payload,
        filteredData: searchSortedData,
        pagination: { ...state.pagination, page: 1 },
      };

    case "SET_PAGINATION":
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload },
      };

    case "SELECT_ROW":
      const newSelectedRows = new Set(state.selectedRows);
      if (newSelectedRows.has(action.payload)) {
        newSelectedRows.delete(action.payload);
      } else {
        newSelectedRows.add(action.payload);
      }
      return { ...state, selectedRows: newSelectedRows };

    case "SELECT_ALL_ROWS":
      const currentPageRows = state.filteredData
        .slice(
          (state.pagination.page - 1) * state.pagination.pageSize,
          state.pagination.page * state.pagination.pageSize
        )
        .map((row) => String(row.id));

      const newSelection = new Set(state.selectedRows);
      if (action.payload) {
        currentPageRows.forEach((id) => newSelection.add(id));
      } else {
        currentPageRows.forEach((id) => newSelection.delete(id));
      }
      return { ...state, selectedRows: newSelection };

    case "SET_DENSITY":
      return { ...state, density: action.payload };

    case "START_EDIT_CELL":
      return { ...state, editingCell: action.payload };

    case "END_EDIT_CELL":
      return { ...state, editingCell: null };

    case "PIN_COLUMN":
      const { field, side } = action.payload;
      const newPinnedColumns = { ...state.pinnedColumns };

      // Remove from current position
      newPinnedColumns.left = newPinnedColumns.left.filter((f) => f !== field);
      newPinnedColumns.right = newPinnedColumns.right.filter(
        (f) => f !== field
      );

      // Add to new position
      if (side === "left") {
        newPinnedColumns.left.push(field);
      } else if (side === "right") {
        newPinnedColumns.right.push(field);
      }

      return { ...state, pinnedColumns: newPinnedColumns };

    default:
      return state;
  }
};

interface DataGridContextType {
  state: GridState;
  dispatch: React.Dispatch<GridAction>;
}

const DataGridContext = createContext<DataGridContextType | undefined>(
  undefined
);

export const useDataGrid = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider");
  }
  return context;
};

export const DataGridProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gridReducer, initialState);

  // Save preferences to localStorage
  useEffect(() => {
    const preferences = {
      visibleColumns: state.visibleColumns,
      pinnedColumns: state.pinnedColumns,
      density: state.density,
      pageSize: state.pagination.pageSize,
    };
    localStorage.setItem("dataGridPreferences", JSON.stringify(preferences));
  }, [
    state.visibleColumns,
    state.pinnedColumns,
    state.density,
    state.pagination.pageSize,
  ]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dataGridPreferences");
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        // Apply saved preferences when columns are set
        if (state.columns.length > 0 && preferences.visibleColumns) {
          dispatch({
            type: "SET_PAGINATION",
            payload: { pageSize: preferences.pageSize || 25 },
          });
          dispatch({
            type: "SET_DENSITY",
            payload: preferences.density || "standard",
          });
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    }
  }, [state.columns]);

  return (
    <DataGridContext.Provider value={{ state, dispatch }}>
      {children}
    </DataGridContext.Provider>
  );
};
