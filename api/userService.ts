import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import ApiBase from "./apiBase";

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

const userOverrides = new Map<string, Partial<UserProfile>>();
const userOverridesFileUri = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}kidscape-user-overrides.json`
  : null;

let hasLoadedUserOverrides = false;
let userOverridesLoadPromise: Promise<void> | null = null;

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

const mergeUserWithOverride = (user: UserProfile): UserProfile => {
  const override = userOverrides.get(user.id);

  if (!override) {
    return user;
  }

  return normalizeUser({
    ...user,
    ...override,
    id: user.id,
  });
};

const getStoredUsers = (): UserProfile[] => {
  return Array.from(userOverrides.entries()).map(([id, value]) =>
    normalizeUser({
      ...value,
      id,
    })
  );
};

const persistUserOverrides = async (): Promise<void> => {
  if (!userOverridesFileUri) {
    return;
  }

  await FileSystem.writeAsStringAsync(
    userOverridesFileUri,
    JSON.stringify(Object.fromEntries(userOverrides))
  );
};

const loadUserOverrides = async (): Promise<void> => {
  if (hasLoadedUserOverrides) {
    return;
  }

  if (!userOverridesLoadPromise) {
    userOverridesLoadPromise = (async () => {
      if (!userOverridesFileUri) {
        hasLoadedUserOverrides = true;
        return;
      }

      try {
        const fileInfo = await FileSystem.getInfoAsync(userOverridesFileUri);

        if (!fileInfo.exists) {
          hasLoadedUserOverrides = true;
          return;
        }

        const savedOverrides = await FileSystem.readAsStringAsync(userOverridesFileUri);
        const parsedOverrides = JSON.parse(savedOverrides) as Record<string, unknown>;

        for (const [id, value] of Object.entries(parsedOverrides)) {
          if (!isUserProfile(value)) {
            continue;
          }

          userOverrides.set(id, value);
        }
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

const flattenUsers = (payload: unknown): UserProfile[] => {
  if (Array.isArray(payload)) {
    return payload.flatMap(flattenUsers);
  }

  if (isUserProfile(payload)) {
    return [normalizeUser(payload)];
  }

  return [];
};

export const getUsers = async (): Promise<UserProfile[]> => {
  await loadUserOverrides();

  try {
    const response = await ApiBase.get("/users");
    return flattenUsers(response.data).map(mergeUserWithOverride);
  } catch {
    const storedUsers = getStoredUsers();

    if (storedUsers.length) {
      return storedUsers;
    }

    throw new Error("Unable to load users");
  }
};

export const getUser = async (id: number | string): Promise<UserProfile> => {
  const normalizedId = String(id);

  await loadUserOverrides();

  try {
    const response = await ApiBase.get(`/users/${normalizedId}`);
    const users = flattenUsers(response.data);

    if (users[0]) {
      return mergeUserWithOverride(users[0]);
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

    return mergeUserWithOverride(matchedUser);
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

export type UpdateUserPayload = Omit<UserProfile, "id">;

export const updateUser = async (
  id: number | string,
  payload: UpdateUserPayload
): Promise<UserProfile> => {
  const normalizedId = String(id);

  await loadUserOverrides();

  try {
    const response = await ApiBase.put(`/users/${normalizedId}`, payload);
    const users = flattenUsers(response.data);

    if (!users[0]) {
      throw new Error(`Unable to update user ${normalizedId}`);
    }

    const updatedUser = normalizeUser({
      ...users[0],
      ...payload,
      id: normalizedId,
    });

    userOverrides.set(normalizedId, updatedUser);
    await persistUserOverrides();

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

  userOverrides.set(normalizedId, updatedUser);
  await persistUserOverrides();

  return updatedUser;
};
