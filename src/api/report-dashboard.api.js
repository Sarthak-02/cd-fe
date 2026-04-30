import axiosInstance from "./axios";

export const getAllDashboardConfigsApi = (campus_id) =>
  axiosInstance.get(`/dashboard-config/all?campus_id=${campus_id}`);

export const getDashboardConfigApi = (config_id) =>
  axiosInstance.get(`/dashboard-config?config_id=${config_id}`);

export const createDashboardConfigApi = (data) =>
  axiosInstance.post(`/dashboard-config`, data);

export const updateDashboardConfigApi = (data) =>
  axiosInstance.put(`/dashboard-config`, data);

export const deleteDashboardConfigApi = (config_id) =>
  axiosInstance.delete(`/dashboard-config?config_id=${config_id}`);
