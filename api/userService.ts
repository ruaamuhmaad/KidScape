import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import ApiBase from "./apiBase";
import {
  flattenUsers,
  getFirstUser,
  mergeUserWithOverride,
  normalizeUser,
  overridesToUsers,
  readPersistedOverrides,
  replaceOverrideMap,
  writePersistedOverrides,
} from "./user.service.shared";
import type {
  UpdateUserPayload,
  UserId,
  UserProfile,
  UserProfileDraft,
} from "./user.types";

export type { UpdateUserPayload, UserProfile } from "./user.types";

const userOverrides = new Map<string, UserProfileDraft>();
const userOverridesFileUri = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}kidscape-user-overrides.json`
  : null;

let hasLoadedUserOverrides = false;
let userOverridesLoadPromise: Promise<void> | null = null;

const mergeUser = (user: UserProfile): UserProfile => {
  return mergeUserWithOverride(user, userOverrides.get(user.id));
};

const getStoredUsers = (): UserProfile[] => {
  return overridesToUsers(userOverrides.entries());
};

const persistUserOverrides = async (): Promise<void> => {
  await writePersistedOverrides(Object.fromEntries(userOverrides), {
    fileUri: userOverridesFileUri,
  });
};

const saveUserOverride = async (
  id: string,
  user: UserProfile
): Promise<void> => {
  userOverrides.set(id, user);
  await persistUserOverrides();
};

const loadUserOverrides = async (): Promise<void> => {
  if (hasLoadedUserOverrides) {
    return;
  }

  if (!userOverridesLoadPromise) {
    userOverridesLoadPromise = (async () => {
      try {
        replaceOverrideMap(
          userOverrides,
          await readPersistedOverrides({ fileUri: userOverridesFileUri })
        );
      } catch {
        userOverrides.clear();
      } finally {
        hasLoadedUserOverrides = true;
      }
    })().finally(() => {
      userOverridesLoadPromise = null;
    });
  }

  await userOverridesLoadPromise;
};

export const getUsers = async (): Promise<UserProfile[]> => {
  await loadUserOverrides();

  try {
    const response = await ApiBase.get("/users");
    return flattenUsers(response.data).map(mergeUser);
  } catch {
    const storedUsers = getStoredUsers();

    if (storedUsers.length) {
      return storedUsers;
    }

    throw new Error("Unable to load users");
  }
};

export const getUser = async (id: UserId): Promise<UserProfile> => {
  const normalizedId = String(id);

  await loadUserOverrides();

  try {
    const response = await ApiBase.get(`/users/${normalizedId}`);
    const user = getFirstUser(response.data);

    if (user) {
      return mergeUser(user);
    }
  } catch {
    // Fall back to the collection endpoint if the item endpoint is unavailable.
  }

  try {
    const users = await getUsers();
    const matchedUser = users.find((user) => user.id === normalizedId);

    if (!matchedUser) {
      throw new Error(`User ${normalizedId} not found`);
    }

    return matchedUser;
  } catch {
    const storedUser = userOverrides.get(normalizedId);

    if (!storedUser) {
      throw new Error(`User ${normalizedId} not found`);
    }

    return normalizeUser({
      ...storedUser,
      id: normalizedId,
    });
  }
};

export const updateUser = async (
  id: UserId,
  payload: UpdateUserPayload
): Promise<UserProfile> => {
  const normalizedId = String(id);

  await loadUserOverrides();

  try {
    const response = await ApiBase.put(`/users/${normalizedId}`, payload);
    const user = getFirstUser(response.data);

    if (!user) {
      throw new Error(`Unable to update user ${normalizedId}`);
    }

    const updatedUser = normalizeUser({
      ...user,
      ...payload,
      id: normalizedId,
    });

    await saveUserOverride(normalizedId, updatedUser);
    return updatedUser;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }
  }

  const currentUser = await getUser(normalizedId);
  const updatedUser = normalizeUser({
    ...currentUser,
    ...payload,
    id: normalizedId,
  });

  await saveUserOverride(normalizedId, updatedUser);
  return updatedUser;
};
