import apiClient from "./apiClient";

export async function fetchTitles(params = {}) {
  const res = await apiClient.get("/titles", { params });
  return res.data;
}

export async function fetchTitle(id) {
  const res = await apiClient.get(`/titles/${id}`);
  return res.data;
}

export async function createTitle(payload) {
  const res = await apiClient.post("/titles", payload);
  return res.data;
}

export async function updateTitle(id, payload) {
  const res = await apiClient.put(`/titles/${id}`, payload);
  return res.data;
}

export async function deleteTitle(id) {
  await apiClient.delete(`/titles/${id}`);
}
