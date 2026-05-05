import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { getDb, getFirebaseAuth } from './config';
import {
  DEFAULT_PARENT_PERMISSIONS,
  DEFAULT_PARENT_ROLE,
} from './userProfile';

export interface SignUpPayload {
  email: string;
  password: string;
  fullName?: string;
  mobile?: string;
  emergency?: string;
  address?: string;
  city?: string;
  imageUrl?: string;
}

export interface UserProfileDocument {
  uid: string;
  email: string;
  fullName: string;
  displayName: string;
  mobile: string;
  emergency: string;
  address: string;
  city: string;
  imageUrl: string;
  role: string;
  permissions: string[];
  PName: string;
  Email: string;
  Phone: string;
  Address: string;
  EmergencyNumber: string;
  City: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const emptySignUpPayload: SignUpPayload = {
  email: '',
  password: '',
  fullName: '',
  mobile: '',
  emergency: '',
  address: '',
  city: '',
  imageUrl: '',
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const normalizeText = (value?: string) => value?.trim() ?? '';

const mapAuthError = (error: unknown): Error => {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error : new Error('Unknown authentication error.');
  }

  switch (error.code) {
    case 'auth/configuration-not-found':
      return new Error(
        'Firebase Authentication is not configured for this project. Open Firebase Console > Authentication > Sign-in method and enable Email/Password.'
      );
    case 'auth/operation-not-allowed':
      return new Error(
        'The Email/Password sign-in provider is disabled in Firebase Console. Enable it from Authentication > Sign-in method.'
      );
    default:
      return error;
  }
};

const buildSignUpPayload = (
  emailOrPayload: string | SignUpPayload,
  password?: string
): SignUpPayload => {
  if (typeof emailOrPayload === 'string') {
    return {
      ...emptySignUpPayload,
      email: emailOrPayload,
      password: password ?? '',
    };
  }

  return {
    ...emptySignUpPayload,
    ...emailOrPayload,
  };
};

const buildUserProfileDocument = (
  userId: string,
  payload: SignUpPayload
): UserProfileDocument => {
  const now = Timestamp.now();
  const fullName = normalizeText(payload.fullName);
  const email = normalizeEmail(payload.email);
  const mobile = normalizeText(payload.mobile);
  const emergency = normalizeText(payload.emergency);
  const address = normalizeText(payload.address);
  const city = normalizeText(payload.city);
  const imageUrl = normalizeText(payload.imageUrl);

  return {
    uid: userId,
    email,
    fullName,
    displayName: fullName,
    mobile,
    emergency,
    address,
    city,
    imageUrl,
    role: DEFAULT_PARENT_ROLE,
    permissions: DEFAULT_PARENT_PERMISSIONS,
    PName: fullName,
    Email: email,
    Phone: mobile,
    Address: address,
    EmergencyNumber: emergency,
    City: city,
    createdAt: now,
    updatedAt: now,
  };
};

const saveUserProfile = async (userId: string, payload: SignUpPayload) => {
  const db = getDb();
  const profileData = buildUserProfileDocument(userId, payload);

  await setDoc(doc(db, 'users', userId), profileData, { merge: true });
};

export function signUp(email: string, password: string): Promise<UserCredential>;
export function signUp(payload: SignUpPayload): Promise<UserCredential>;
export async function signUp(
  emailOrPayload: string | SignUpPayload,
  password?: string
): Promise<UserCredential> {
  try {
    const payload = buildSignUpPayload(emailOrPayload, password);
    const auth = getFirebaseAuth();
    const email = normalizeEmail(payload.email);
    const fullName = normalizeText(payload.fullName);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      payload.password
    );

    await userCredential.user.getIdToken();

    if (fullName) {
      await updateProfile(userCredential.user, { displayName: fullName });
    }

    await saveUserProfile(userCredential.user.uid, {
      ...payload,
      email,
      fullName,
    });

    return userCredential;
  } catch (error) {
    throw mapAuthError(error);
  }
}

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      normalizeEmail(email),
      password
    );

    await userCredential.user.getIdToken();

    return userCredential;
  } catch (error) {
    throw mapAuthError(error);
  }
};

export const resetPassword = async (email: string) => {
  try {
    return await sendPasswordResetEmail(getFirebaseAuth(), normalizeEmail(email));
  } catch (error) {
    throw mapAuthError(error);
  }
};

export const logout = () => {
  return signOut(getFirebaseAuth());
};

export const getCurrentUser = (): User | null => {
  return getFirebaseAuth().currentUser;
};

export const onUserStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(getFirebaseAuth(), callback);
};
