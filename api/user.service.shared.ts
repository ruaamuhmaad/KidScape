import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";
import type { UserProfile, UserProfileDraft } from "./user.types";

export type UserOverrides = Record<string, UserProfileDraft>;

type PersistedOverridesConfig = {
  directoryUri?: string | null;
  fileUri: string | null;
  storageKey?: string;
};

export const isUserProfileDraft = (
  value: unknown
): value is UserProfileDraft => {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
};

export const normalizeUser = (value: UserProfileDraft): UserProfile => {
  return {
    id: String(value.id ?? ""),
    PName: value.PName ?? "",
    imageUrl: value.imageUrl ?? "",
    Email: value.Email ?? "",
    Phone: value.Phone ?? "",
    Address: value.Address ?? "",
    EmergencyNumber: value.EmergencyNumber ?? "",
    ChildName: value.ChildName ?? "",
    City: value.City ?? "",
  };
};

export const flattenUsers = (payload: unknown): UserProfile[] => {
  if (Array.isArray(payload)) {
    return payload.flatMap(flattenUsers);
  }

  return isUserProfileDraft(payload) ? [normalizeUser(payload)] : [];
};

export const getFirstUser = (payload: unknown): UserProfile | null => {
  return flattenUsers(payload)[0] ?? null;
};

export const mergeUserWithOverride = (
  user: UserProfile,
  override?: UserProfileDraft
): UserProfile => {
  if (!override) {
    return user;
  }

  return normalizeUser({
    ...user,
    ...override,
    id: user.id,
  });
};

export const overridesToUsers = (
  entries: Iterable<[string, UserProfileDraft]>
): UserProfile[] => {
  return Array.from(entries, ([id, override]) =>
    normalizeUser({
      ...override,
      id,
    })
  );
};

export const sanitizeUserOverrides = (value: unknown): UserOverrides => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const sanitized: UserOverrides = {};

  for (const [id, override] of Object.entries(value)) {
    if (isUserProfileDraft(override)) {
      sanitized[id] = override;
    }
  }

  return sanitized;
};

export const replaceOverrideMap = (
  target: Map<string, UserProfileDraft>,
  overrides: UserOverrides
): void => {
  target.clear();

  for (const [id, override] of Object.entries(overrides)) {
    target.set(id, override);
  }
};

export const readPersistedOverrides = async ({
  fileUri,
  storageKey,
}: PersistedOverridesConfig): Promise<UserOverrides> => {
  if (Platform.OS === "web" && storageKey) {
    const savedContent = globalThis.localStorage?.getItem(storageKey);
    return savedContent ? sanitizeUserOverrides(JSON.parse(savedContent)) : {};
  }

  if (!fileUri) {
    return {};
  }

  const fileInfo = await FileSystem.getInfoAsync(fileUri);

  if (!fileInfo.exists) {
    return {};
  }

  const savedContent = await FileSystem.readAsStringAsync(fileUri);

  return savedContent.trim()
    ? sanitizeUserOverrides(JSON.parse(savedContent))
    : {};
};

export const writePersistedOverrides = async (
  overrides: UserOverrides,
  { directoryUri, fileUri, storageKey }: PersistedOverridesConfig
): Promise<void> => {
  const serializedOverrides = JSON.stringify(overrides);

  if (Platform.OS === "web" && storageKey) {
    globalThis.localStorage?.setItem(storageKey, serializedOverrides);
    return;
  }

  if (!fileUri) {
    return;
  }

  if (directoryUri) {
    const directoryInfo = await FileSystem.getInfoAsync(directoryUri);

    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(directoryUri, {
        intermediates: true,
      });
    }
  }

  await FileSystem.writeAsStringAsync(fileUri, serializedOverrides);
};
