import apiClient from "./apiClient";

export async function fetchReviewsByTitle(titleId, params = {}) {
  const res = await apiClient.get(`/reviews/title/${titleId}`, { params });
  return res.data;
}

export async function fetchMyReviews() {
  const res = await apiClient.get("/reviews/me");
  return res.data;
}

export async function createReview(titleId, payload) {
  const res = await apiClient.post(`/reviews/title/${titleId}`, payload);
  return res.data;
}

export async function updateReview(id, payload) {
  const res = await apiClient.put(`/reviews/${id}`, payload);
  return res.data;
}

export async function deleteReview(reviewId) {
  await apiClient.delete(`/reviews/${reviewId}`);
}