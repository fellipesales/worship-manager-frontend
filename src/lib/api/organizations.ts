import api from "./client";
import type { Organization } from "@/lib/types";

export const organizationsApi = {
  getCurrent: () => api.get<Organization>("/api/organizations/current").then((r) => r.data),
  create: (data: { name: string }) => api.post<Organization>("/api/organizations", data).then((r) => r.data),
  join: (inviteCode: string) => api.post("/api/organizations/join", { inviteCode }).then((r) => r.data),
  update: (id: number, data: Partial<Organization>) => api.put(`/api/organizations/${id}`, data).then((r) => r.data),
  switch: (id: number) => api.post(`/api/organizations/${id}/switch`).then((r) => r.data),
  regenerateInvite: (id: number) => api.post(`/api/organizations/${id}/regenerate-invite`).then((r) => r.data),
  getMembers: (id: number) => api.get(`/api/organizations/${id}/members`).then((r) => r.data),
  updateMemberRole: (orgId: number, userId: string, role: string) =>
    api.put(`/api/organizations/${orgId}/members/${userId}/role`, { role }).then((r) => r.data),
  removeMember: (orgId: number, userId: string) => api.delete(`/api/organizations/${orgId}/members/${userId}`),
};
