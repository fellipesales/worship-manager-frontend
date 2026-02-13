import api from "./client";
import type { Schedule } from "@/lib/types";

export const schedulesApi = {
  getAll: () => api.get<Schedule[]>("/api/schedules").then((r) => r.data),
  getById: (id: number) => api.get<Schedule>(`/api/schedules/${id}`).then((r) => r.data),
  create: (data: Partial<Schedule>) => api.post<Schedule>("/api/schedules", data).then((r) => r.data),
  update: (id: number, data: Partial<Schedule>) => api.put<Schedule>(`/api/schedules/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/api/schedules/${id}`),
  getUpcoming: () => api.get<Schedule[]>("/api/schedules/upcoming").then((r) => r.data),
  getByDateRange: (start: string, end: string) => api.get<Schedule[]>(`/api/schedules/range?start=${start}&end=${end}`).then((r) => r.data),
  generate: (data: { date: string; serviceType: string }) => api.post<Schedule>("/api/schedules/generate", data).then((r) => r.data),
  confirm: (id: number) => api.post(`/api/schedules/${id}/confirm`).then((r) => r.data),
  complete: (id: number) => api.post(`/api/schedules/${id}/complete`).then((r) => r.data),
  cancel: (id: number) => api.post(`/api/schedules/${id}/cancel`).then((r) => r.data),
  notify: (id: number) => api.post(`/api/schedules/${id}/notify`).then((r) => r.data),
};
