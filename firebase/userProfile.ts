import type { UpdateUserPayload, UserProfile } from '@/api/user.types';
import {
  getIdTokenResult,
  updateProfile,
  type IdTokenResult,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

import { getDb, getFirebaseAuth } from './config';

export const DEFAULT_PARENT_ROLE = 'parent';
export const DEFAULT_PARENT_PERMISSIONS = [
  'profile:read',
  'profile:update',
  'children:manage',
  'bookings:create',
  'reviews:create',
];

export type AuthenticatedUserProfile = UserProfile & {
  uid: string;
  idToken: string;
  emailVerified: boolean;
  role: string;
  permissions: string[];
  claims: Record<string, unknown>;
};

type FirebaseUserProfileData = Record<string, unknown>;

const normalizeText = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : '';
};

const firstText = (...values: unknown[]): string => {
  for (const value of values) {
    const normalizedValue = normalizeText(value);

    if (normalizedValue) {
      return normalizedValue;
    }
  }

  return '';
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const readRole = (
  data: FirebaseUserProfileData,
  tokenResult: IdTokenResult
): string => {
  return firstText(tokenResult.claims.role, data.role) || DEFAULT_PARENT_ROLE;
};

const readPermissions = (
  data: FirebaseUserProfileData,
  tokenResult: IdTokenResult
): string[] => {
  const permissionsFromClaims = toStringArray(tokenResult.claims.permissions);
  const permissionsFromProfile = toStringArray(data.permissions);
  const permissions = permissionsFromClaims.length
    ? permissionsFromClaims
    : permissionsFromProfile;

  return permissions.length ? permissions : DEFAULT_PARENT_PERMISSIONS;
};

const mapFirebaseProfile = (
  user: User,
  data: FirebaseUserProfileData,
  tokenResult: IdTokenResult
): AuthenticatedUserProfile => {
  const city = firstText(data.City, data.city);
  const address = firstText(data.Address, data.address, data.location, city);
  const fullName = firstText(
    data.PName,
    data.fullName,
    data.displayName,
    data.name,
    user.displayName
  );

  return {
    id: user.uid,
    uid: user.uid,
    PName: fullName,
    imageUrl: firstText(data.imageUrl, data.photoURL, data.avatarUrl, user.photoURL),
    Email: firstText(data.Email, data.email, user.email),
    Phone: firstText(data.Phone, data.mobile, data.phone, user.phoneNumber),
    Address: address,
    EmergencyNumber: firstText(
      data.EmergencyNumber,
      data.emergency,
      data.emergencyContact
    ),
    ChildName: firstText(data.ChildName, data.childName),
    City: city || address,
    idToken: tokenResult.token,
    emailVerified: user.emailVerified,
    role: readRole(data, tokenResult),
    permissions: readPermissions(data, tokenResult),
    claims: tokenResult.claims,
  };
};

const createDefaultProfileData = (user: User): FirebaseUserProfileData => {
  const now = Timestamp.now();
  const email = user.email ?? '';
  const displayName = user.displayName ?? '';
  const imageUrl = user.photoURL ?? '';

  return {
    uid: user.uid,
    email,
    fullName: displayName,
    displayName,
    mobile: user.phoneNumber ?? '',
    emergency: '',
    address: '',
    city: '',
    imageUrl,
    role: DEFAULT_PARENT_ROLE,
    permissions: DEFAULT_PARENT_PERMISSIONS,
    PName: displayName,
    Email: email,
    Phone: user.phoneNumber ?? '',
    Address: '',
    EmergencyNumber: '',
    City: '',
    createdAt: now,
    updatedAt: now,
  };
};

const buildProfileUpdateData = (
  user: User,
  payload: UpdateUserPayload
): FirebaseUserProfileData => {
  const now = Timestamp.now();
  const fullName = normalizeText(payload.PName);
  const email = normalizeText(payload.Email) || user.email || '';
  const phone = normalizeText(payload.Phone);
  const address = normalizeText(payload.Address);
  const emergency = normalizeText(payload.EmergencyNumber);
  const city = normalizeText(payload.City) || address;
  const imageUrl = normalizeText(payload.imageUrl);

  return {
    uid: user.uid,
    email,
    fullName,
    displayName: fullName,
    mobile: phone,
    emergency,
    address,
    city,
    imageUrl,
    PName: fullName,
    Email: email,
    Phone: phone,
    Address: address,
    EmergencyNumber: emergency,
    City: city,
    updatedAt: now,
  };
};

const requireCurrentUser = async (): Promise<User> => {
  const auth = getFirebaseAuth();

  await auth.authStateReady();

  const user = auth.currentUser;

  if (!user) {
    throw new Error('Please log in to view your profile.');
  }

  return user;
};

const ensureProfileDocument = async (user: User): Promise<FirebaseUserProfileData> => {
  const db = getDb();
  const profileRef = doc(db, 'users', user.uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    return profileSnap.data() as FirebaseUserProfileData;
  }

  const defaultProfile = createDefaultProfileData(user);
  await setDoc(profileRef, defaultProfile, { merge: true });

  return defaultProfile;
};

export const getCurrentUserProfile = async (): Promise<AuthenticatedUserProfile> => {
  const user = await requireCurrentUser();
  const [tokenResult, profileData] = await Promise.all([
    getIdTokenResult(user),
    ensureProfileDocument(user),
  ]);

  return mapFirebaseProfile(user, profileData, tokenResult);
};

export const updateCurrentUserProfile = async (
  payload: UpdateUserPayload
): Promise<AuthenticatedUserProfile> => {
  const user = await requireCurrentUser();
  const currentProfile = await getCurrentUserProfile();

  if (!currentProfile.permissions.includes('profile:update')) {
    throw new Error('You do not have permission to update this profile.');
  }

  const profileRef = doc(getDb(), 'users', user.uid);
  const updateData = buildProfileUpdateData(user, payload);

  await setDoc(profileRef, updateData, { merge: true });

  const displayName = normalizeText(payload.PName);
  const photoURL = normalizeText(payload.imageUrl) || null;

  if (displayName !== user.displayName || photoURL !== user.photoURL) {
    await updateProfile(user, { displayName, photoURL });
  }

  return getCurrentUserProfile();
};
