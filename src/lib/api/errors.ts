import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

type ErrorWithData = { data?: { message?: unknown; errorMessages?: unknown } };

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

/**
 * Extracts a human readable message from an RTK Query / fetch error.
 * Mirrors the backend response shape `{ success: false, message: "..." }`.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if (isFetchBaseQueryError(error)) {
    const message = (error as ErrorWithData).data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (error.status === "FETCH_ERROR") return "Network error. Please check your connection.";
    if (error.status === "TIMEOUT_ERROR") return "The request timed out. Please try again.";
    return fallback;
  }

  const serialized = error as SerializedError;
  if (typeof serialized?.message === "string" && serialized.message.trim()) {
    return serialized.message;
  }

  return fallback;
}
