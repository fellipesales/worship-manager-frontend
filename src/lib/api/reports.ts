import api from "./client";

export const reportsApi = {
  getDashboard: () => api.get("/api/reports/dashboard").then((r) => r.data),
  getParticipation: (start: string, end: string) =>
    api.get(`/api/reports/participation?start=${start}&end=${end}`).then((r) => r.data),
  getInstrumentStats: () => api.get("/api/reports/instruments").then((r) => r.data),
  exportPdf: (start: string, end: string) =>
    api.get(`/api/reports/export/pdf?start=${start}&end=${end}`, { responseType: "blob" }).then((r) => r.data),
  exportExcel: (start: string, end: string) =>
    api.get(`/api/reports/export/excel?start=${start}&end=${end}`, { responseType: "blob" }).then((r) => r.data),
};
