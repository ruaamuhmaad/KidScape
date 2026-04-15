import * as FileSystem from "expo-file-system/legacy";
import ApiBase from "./apiBase";
import {
  flattenUsers,
  getFirstUser,
  mergeUserWithOverride,
  normalizeUser,
  overridesToUsers,
  readPersistedOverrides,
  writePersistedOverrides,
} from "./user.service.shared";
import type {
  UpdateUserPayload,
  UserId,
  UserProfile,
  UserProfileDraft,
} from "./user.types";

export type { UpdateUserPayload, UserProfile } from "./user.types";

type UserOverrides = Record<string, UserProfileDraft>;

const STORAGE_KEY = "kidscape-edited-user-profile";
const storageDirectoryUri = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}kidscape`
  : null;
const storageFileUri = storageDirectoryUri
  ? `${storageDirectoryUri}/edited-user-profile.json`
  : null;

let cachedOverrides: UserOverrides | null = null;
let loadOverridesPromise: Promise<UserOverrides> | null = null;

const readStoredOverrides = async (): Promise<UserOverrides> => {
  return readPersistedOverrides({
    fileUri: storageFileUri,
    storageKey: STORAGE_KEY,
  });
};

const ensureOverridesLoaded = async (): Promise<UserOverrides> => {
  if (cachedOverrides) {
    return cachedOverrides;
  }

  if (!loadOverridesPromise) {
    loadOverridesPromise = (async () => {
      try {
        cachedOverrides = await readStoredOverrides();
      } catch {
        cachedOverrides = {};
      } finally {
        loadOverridesPromise = null;
      }

      return cachedOverrides;
    })();
  }

  return loadOverridesPromise;
};

const persistOverrides = async (overrides: UserOverrides): Promise<void> => {
  await writePersistedOverrides(overrides, {
    directoryUri: storageDirectoryUri,
    fileUri: storageFileUri,
    storageKey: STORAGE_KEY,
  });
};

const saveOverride = async (
  overrides: UserOverrides,
  id: string,
  user: UserProfile
): Promise<void> => {
  overrides[id] = user;
  cachedOverrides = overrides;
  await persistOverrides(overrides);
};

const getStoredUsers = (overrides: UserOverrides): UserProfile[] => {
  return overridesToUsers(Object.entries(overrides));
};

const getUsersFromApi = async (): Promise<UserProfile[]> => {
  const response = await ApiBase.get("/users");
  return flattenUsers(response.data);
};

const getUserFromApi = async (id: string): Promise<UserProfile | null> => {
  try {
    const response = await ApiBase.get(`/users/${id}`);
    return getFirstUser(response.data);
  } catch {
    return null;
  }
};

const mergeUser = (
  user: UserProfile,
  overrides: UserOverrides
): UserProfile => {
  return mergeUserWithOverride(user, overrides[user.id]);
};

export const getUsers = async (): Promise<UserProfile[]> => {
  const overrides = await ensureOverridesLoaded();

  try {
    const mergedUsers = (await getUsersFromApi()).map((user) =>
      mergeUser(user, overrides)
    );
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

export const getUser = async (id: UserId): Promise<UserProfile> => {
  const normalizedId = String(id);
  const overrides = await ensureOverridesLoaded();
  const userFromItemEndpoint = await getUserFromApi(normalizedId);

  if (userFromItemEndpoint) {
    return mergeUser(userFromItemEndpoint, overrides);
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

export const updateUser = async (
  id: UserId,
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

  await saveOverride(overrides, normalizedId, locallyUpdatedUser);

  try {
    const response = await ApiBase.put(`/users/${normalizedId}`, payload);
    const user = getFirstUser(response.data);

    if (!user) {
      return locallyUpdatedUser;
    }

    const remotelyUpdatedUser = normalizeUser({
      ...user,
      ...payload,
      id: normalizedId,
    });

    await saveOverride(overrides, normalizedId, remotelyUpdatedUser);
    return remotelyUpdatedUser;
  } catch {
    return locallyUpdatedUser;
  }
};
