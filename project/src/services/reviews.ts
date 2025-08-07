import { api } from "./client";

export async function createReview(payload: {
  salon_id: string | number;
  ocena: number;        // 1-5
  komentar: string;
}) {
  const { data } = await api.post("/reviews", payload);
  return data;
}

export async function getSalonReviews(salonId: string | number) {
  const { data } = await api.get(`/reviews/salons/${salonId}/reviews`);
  return data;
}

export async function getUserReviews(userId: string | number) {
  const { data } = await api.get(`/reviews/user/${userId}`);
  return data;
}

export async function deleteReview(reviewId: string | number) {
  const { data } = await api.delete(`/reviews/${reviewId}`);
  return data;
} 