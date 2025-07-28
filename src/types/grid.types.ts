/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  joinDate: string;
  status: "active" | "inactive";
  avatar?: string;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Column {
  field: string;
  headerName: string;
  width: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  type?: "string" | "number" | "date" | "select" | "actions";
  valueOptions?: string[];
  renderCell?: (params: CellParams) => React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  pinned?: "left" | "right" | null;
  visible?: boolean;
}

export interface CellParams {
  value: any;
  row: any;
  field: string;
  colDef: Column;
}

export interface SortModel {
  field: string;
  sort: "asc" | "desc";
}

export interface FilterModel {
  [field: string]: {
    value: any;
    operator:
      | "contains"
      | "equals"
      | "startsWith"
      | "endsWith"
      | "gt"
      | "lt"
      | "gte"
      | "lte";
  };
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface GridState {
  data: any[];
  filteredData: any[];
  columns: Column[];
  visibleColumns: string[];
  pinnedColumns: { left: string[]; right: string[] };
  sortModel: SortModel[];
  filterModel: FilterModel;
  selectedRows: Set<string>;
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  density: "compact" | "standard" | "comfortable";
  editingCell: { rowId: string; field: string } | null;
}

export type GridAction =
  | { type: "SET_DATA"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_COLUMNS"; payload: Column[] }
  | { type: "TOGGLE_COLUMN_VISIBILITY"; payload: string }
  | { type: "REORDER_COLUMNS"; payload: { from: number; to: number } }
  | { type: "RESIZE_COLUMN"; payload: { field: string; width: number } }
  | { type: "SET_SORT"; payload: SortModel[] }
  | {
      type: "SET_FILTER";
      payload: { field: string; value: any; operator: string };
    }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_PAGINATION"; payload: Partial<PaginationState> }
  | { type: "SELECT_ROW"; payload: string }
  | { type: "SELECT_ALL_ROWS"; payload: boolean }
  | { type: "SET_DENSITY"; payload: "compact" | "standard" | "comfortable" }
  | { type: "START_EDIT_CELL"; payload: { rowId: string; field: string } }
  | { type: "END_EDIT_CELL" }
  | {
      type: "PIN_COLUMN";
      payload: { field: string; side: "left" | "right" | null };
    };
