import api from "./client";
import type { OrganizationSettings, MessageTemplate } from "@/lib/types";

export const settingsApi = {
  get: () => api.get<OrganizationSettings>("/api/settings").then((r) => r.data),
  update: (data: Partial<OrganizationSettings>) => api.put("/api/settings", data).then((r) => r.data),
  getTemplates: () => api.get<MessageTemplate[]>("/api/settings/templates").then((r) => r.data),
  updateTemplate: (id: number, data: { template: string; isActive?: boolean }) =>
    api.put(`/api/settings/templates/${id}`, data).then((r) => r.data),
};
