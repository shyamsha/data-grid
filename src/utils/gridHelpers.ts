/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterModel, SortModel } from "../types/grid.types";

export const sortData = (data: any[], sortModel: SortModel[]): any[] => {
  if (!sortModel.length) return data;

  return [...data].sort((a, b) => {
    for (const sort of sortModel) {
      const { field, sort: direction } = sort;
      const aVal = a[field];
      const bVal = b[field];

      if (aVal === bVal) continue;

      const comparison = aVal > bVal ? 1 : -1;
      return direction === "asc" ? comparison : -comparison;
    }
    return 0;
  });
};

export const filterData = (
  data: any[],
  filterModel: FilterModel,
  searchQuery: string
): any[] => {
  let filtered = data;

  // Apply column filters
  Object.entries(filterModel).forEach(([field, filter]) => {
    if (!filter.value) return;

    filtered = filtered.filter((row) => {
      const value = row[field];
      const filterValue = filter.value;

      switch (filter.operator) {
        case "contains":
          return String(value)
            .toLowerCase()
            .includes(String(filterValue).toLowerCase());
        case "equals":
          return value === filterValue;
        case "startsWith":
          return String(value)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase());
        case "endsWith":
          return String(value)
            .toLowerCase()
            .endsWith(String(filterValue).toLowerCase());
        case "gt":
          return Number(value) > Number(filterValue);
        case "lt":
          return Number(value) < Number(filterValue);
        case "gte":
          return Number(value) >= Number(filterValue);
        case "lte":
          return Number(value) <= Number(filterValue);
        default:
          return true;
      }
    });
  });

  // Apply global search
  if (searchQuery) {
    filtered = filtered.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  return filtered;
};

export const exportToCSV = (
  data: any[],
  columns: any[],
  filename: string = "export.csv"
) => {
  const headers = columns.map((col) => col.headerName).join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const value = row[col.field];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      })
      .join(",")
  );

  const csv = [headers, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any[], filename: string = "export.json") => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};
