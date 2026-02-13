import api from "./client";
import type { Member } from "@/lib/types";

export const membersApi = {
  getAll: () => api.get<Member[]>("/api/members").then((r) => r.data),
  getActive: () => api.get<Member[]>("/api/members/active").then((r) => r.data),
  getById: (id: number) => api.get<Member>(`/api/members/${id}`).then((r) => r.data),
  create: (data: Partial<Member>) => api.post<Member>("/api/members", data).then((r) => r.data),
  update: (id: number, data: Partial<Member>) => api.put<Member>(`/api/members/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/api/members/${id}`),
  getByInstrument: (instrument: string) => api.get<Member[]>(`/api/members/instrument/${instrument}`).then((r) => r.data),
  getStatistics: (id: number) => api.get(`/api/members/${id}/statistics`).then((r) => r.data),
};
