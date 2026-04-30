import apiClient from "./apiClient";

export async function login(email, password) {
  const res = await apiClient.post("/auth/login", { email, password });
  return res.data;
}

export async function registerUser(email, password) {
  const res = await apiClient.post("/auth/register", { email, password });
  return res.data;
}
