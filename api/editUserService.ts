import * as FileSystem from "expo-file-system/legacy";
import ApiBase from "./apiBase";
import { Platform } from "react-native";

export interface UserProfile {
  id: string;
  PName: string;
  imageUrl: string;
  Email: string;
  Phone: string;
  Address: string;
  EmergencyNumber: string;
  ChildName?: string;
  City?: string;
}

type UserOverrides = Record<string, Partial<UserProfile>>;

const STORAGE_KEY = "kidscape-edited-user-profile";
const storageFileUri = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}kidscape/edited-user-profile.json`
  : null;

let cachedOverrides: UserOverrides | null = null;
let loadOverridesPromise: Promise<UserOverrides> | null = null;

const isUserProfile = (value: unknown): value is Partial<UserProfile> => {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
};

const normalizeUser = (value: Partial<UserProfile>): UserProfile => {
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

const flattenUsers = (payload: unknown): UserProfile[] => {
  if (Array.isArray(payload)) {
    return payload.flatMap(flattenUsers);
  }

  if (isUserProfile(payload)) {
    return [normalizeUser(payload)];
  }

  return [];
};

const sanitizeOverrides = (value: unknown): UserOverrides => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const sanitized: UserOverrides = {};

  for (const [id, user] of Object.entries(value)) {
    if (!isUserProfile(user)) {
      continue;
    }

    sanitized[id] = user;
  }

  return sanitized;
};

const readStoredOverrides = async (): Promise<UserOverrides> => {
  if (Platform.OS === "web") {
    const savedContent = globalThis.localStorage?.getItem(STORAGE_KEY);

    if (!savedContent) {
      return {};
    }

    return sanitizeOverrides(JSON.parse(savedContent));
  }

  if (!storageFileUri) {
    return {};
  }

  const fileInfo = await FileSystem.getInfoAsync(storageFileUri);

  if (!fileInfo.exists) {
    return {};
  }

  const savedContent = await FileSystem.readAsStringAsync(storageFileUri);

  if (!savedContent.trim()) {
    return {};
  }

  return sanitizeOverrides(JSON.parse(savedContent));
};

const ensureOverridesLoaded = async (): Promise<UserOverrides> => {
  if (cachedOverrides) {
    return cachedOverrides;
  }

  if (!loadOverridesPromise) {
    loadOverridesPromise = (async () => {
      try {
        cachedOverrides = await readStoredOverrides();
        return cachedOverrides;
      } catch {
        cachedOverrides = {};
        return cachedOverrides;
      } finally {
        loadOverridesPromise = null;
      }
    })();
  }

  return loadOverridesPromise;
};

const persistOverrides = async (overrides: UserOverrides): Promise<void> => {
  const serializedOverrides = JSON.stringify(overrides);

  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem(STORAGE_KEY, serializedOverrides);
    return;
  }

  if (!storageFileUri) {
    return;
  }

  const directoryUri = `${FileSystem.documentDirectory}kidscape`;
  const directoryInfo = await FileSystem.getInfoAsync(directoryUri);

  if (!directoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
  }

  await FileSystem.writeAsStringAsync(storageFileUri, serializedOverrides);
};

const mergeUserWithOverride = (
  user: UserProfile,
  overrides: UserOverrides
): UserProfile => {
  const override = overrides[user.id];

  if (!override) {
    return user;
  }

  return normalizeUser({
    ...user,
    ...override,
    id: user.id,
  });
};

const getStoredUsers = (overrides: UserOverrides): UserProfile[] => {
  return Object.entries(overrides).map(([id, user]) =>
    normalizeUser({
      ...user,
      id,
    })
  );
};

const getUsersFromApi = async (): Promise<UserProfile[]> => {
  const response = await ApiBase.get("/users");
  return flattenUsers(response.data);
};

const getUserFromApi = async (id: string): Promise<UserProfile | null> => {
  try {
    const response = await ApiBase.get(`/users/${id}`);
    const users = flattenUsers(response.data);
    return users[0] ?? null;
  } catch {
    return null;
  }
};

export const getUsers = async (): Promise<UserProfile[]> => {
  const overrides = await ensureOverridesLoaded();

  try {
    const users = await getUsersFromApi();
    const mergedUsers = users.map((user) => mergeUserWithOverride(user, overrides));
    const mergedUserIds = new Set(mergedUsers.map((user) => user.id));

    for (const storedUser of getStoredUsers(overrides)) {
      if (!mergedUserIds.has(storedUser.id)) {
        mergedUsers.push(storedUser);
      }
    }

    return mergedUsers;
  } catch {
    const storedUsers = getStoredUsers(overrides);

    if (storedUsers.length) {
      return storedUsers;
    }

    throw new Error("Unable to load users");
  }
};

export const getUser = async (id: number | string): Promise<UserProfile> => {
  const normalizedId = String(id);
  const overrides = await ensureOverridesLoaded();
  const userFromItemEndpoint = await getUserFromApi(normalizedId);

  if (userFromItemEndpoint) {
    return mergeUserWithOverride(userFromItemEndpoint, overrides);
  }

  const users = await getUsers();
  const matchedUser = users.find((user) => user.id === normalizedId);

  if (matchedUser) {
    return matchedUser;
  }

  const storedUser = overrides[normalizedId];

  if (storedUser) {
    return normalizeUser({
      ...storedUser,
      id: normalizedId,
    });
  }

  throw new Error(`User ${normalizedId} not found`);
};

export type UpdateUserPayload = Omit<UserProfile, "id">;

export const updateUser = async (
  id: number | string,
  payload: UpdateUserPayload
): Promise<UserProfile> => {
  const normalizedId = String(id);
  const overrides = await ensureOverridesLoaded();

  let currentUser: UserProfile;

  try {
    currentUser = await getUser(normalizedId);
  } catch {
    currentUser = normalizeUser({ id: normalizedId });
  }

  const locallyUpdatedUser = normalizeUser({
    ...currentUser,
    ...payload,
    id: normalizedId,
  });

  overrides[normalizedId] = locallyUpdatedUser;
  cachedOverrides = overrides;
  await persistOverrides(overrides);

  try {
    const response = await ApiBase.put(`/users/${normalizedId}`, payload);
    const users = flattenUsers(response.data);

    if (!users[0]) {
      return locallyUpdatedUser;
    }

    const remotelyUpdatedUser = normalizeUser({
      ...users[0],
      ...payload,
      id: normalizedId,
    });

    overrides[normalizedId] = remotelyUpdatedUser;
    cachedOverrides = overrides;
    await persistOverrides(overrides);

    return remotelyUpdatedUser;
  } catch {
    return locallyUpdatedUser;
  }
};
