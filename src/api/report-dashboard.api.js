import axiosInstance from "./axios";

export const getAllDashboardConfigsApi = (campus_id) =>
  axiosInstance.get(`/report-dashboard-config/all?campusId=${campus_id}`);

export const getDashboardConfigApi = (config_id) =>
  axiosInstance.get(`/report-dashboard-config?id=${config_id}`);

export const createDashboardConfigApi = (data) =>
  axiosInstance.post(`/report-dashboard-config`, data);

export const updateDashboardConfigApi = (data) =>
  axiosInstance.put(`/report-dashboard-config`, data);

export const deleteDashboardConfigApi = (config_id) =>
  axiosInstance.delete(`/report-dashboard-config?id=${config_id}`);
