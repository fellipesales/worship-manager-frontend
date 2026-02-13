import api from "./client";
import type { Role } from "@/lib/types";

export const rolesApi = {
  getAll: () => api.get<Role[]>("/api/roles").then((r) => r.data),
  getByCategory: (category: string) => api.get<Role[]>(`/api/roles/category/${category}`).then((r) => r.data),
};
