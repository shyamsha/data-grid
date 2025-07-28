export interface ApiError {
  message: string;
  status: number;
}

export interface FetchOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters?: Record<string, any>;
}
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
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
