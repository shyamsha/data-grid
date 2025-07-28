import { User, ApiResponse, FetchOptions } from "../types/api.types";

// Generate mock data
const generateMockUsers = (count: number): User[] => {
  const roles = ["Developer", "Designer", "Manager", "Analyst", "Intern"];
  const departments = ["Engineering", "Design", "Marketing", "Sales", "HR"];
  const statuses: ("active" | "inactive")[] = ["active", "inactive"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@company.com`,
    role: roles[Math.floor(Math.random() * roles.length)],
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 100000) + 40000,
    joinDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split("T")[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
  }));
};

const mockUsers = generateMockUsers(1000);

export const fetchUsers = async (
  options: FetchOptions = {}
): Promise<ApiResponse<User>> => {
  // Simulate network delay
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 500 + 200)
  );

  const {
    page = 1,
    pageSize = 25,
    sortBy,
    sortOrder = "asc",
    search,
    filters = {},
  } = options;

  let filteredUsers = [...mockUsers];

  // Apply search
  if (search) {
    filteredUsers = filteredUsers.filter((user) =>
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  // Apply filters
  Object.entries(filters).forEach(([field, value]) => {
    if (value) {
      filteredUsers = filteredUsers.filter((user) =>
        String(user[field as keyof User])
          .toLowerCase()
          .includes(String(value).toLowerCase())
      );
    }
  });

  // Apply sorting
  if (sortBy) {
    filteredUsers.sort((a, b) => {
      const aVal = a[sortBy as keyof User] ?? "";
      const bVal = b[sortBy as keyof User] ?? "";
      const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = filteredUsers.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
};
