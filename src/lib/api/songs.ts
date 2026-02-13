import api from "./client";
import type { Song } from "@/lib/types";

export const songsApi = {
  getAll: () => api.get<Song[]>("/api/songs").then((r) => r.data),
  getActive: () => api.get<Song[]>("/api/songs/active").then((r) => r.data),
  getById: (id: number) => api.get<Song>(`/api/songs/${id}`).then((r) => r.data),
  create: (data: Partial<Song>) => api.post<Song>("/api/songs", data).then((r) => r.data),
  update: (id: number, data: Partial<Song>) => api.put<Song>(`/api/songs/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/api/songs/${id}`),
  getByCategory: (category: string) => api.get<Song[]>(`/api/songs/category/${category}`).then((r) => r.data),
  search: (query: string) => api.get<Song[]>(`/api/songs/search?q=${query}`).then((r) => r.data),
};
