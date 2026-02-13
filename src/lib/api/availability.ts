import api from "./client";
import type { Availability } from "@/lib/types";

export const availabilityApi = {
  getByMember: (memberId: number) => api.get<Availability[]>(`/api/availability/member/${memberId}`).then((r) => r.data),
  getByDate: (date: string) => api.get<Availability[]>(`/api/availability/date/${date}`).then((r) => r.data),
  getByDateRange: (memberId: number, start: string, end: string) =>
    api.get<Availability[]>(`/api/availability/member/${memberId}/range?start=${start}&end=${end}`).then((r) => r.data),
  set: (data: { memberId: number; date: string; isAvailable: boolean; notes?: string }) =>
    api.post<Availability>("/api/availability", data).then((r) => r.data),
  setBulk: (data: { memberId: number; dates: { date: string; isAvailable: boolean }[] }) =>
    api.post("/api/availability/bulk", data).then((r) => r.data),
  delete: (id: number) => api.delete(`/api/availability/${id}`),
};
