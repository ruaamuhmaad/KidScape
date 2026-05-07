import { router } from "expo-router";

export const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const redirectToLoginIfNeeded = (message: string) => {
  if (message.toLowerCase().includes("log in")) {
    router.replace("/login" as any);
  }
};
