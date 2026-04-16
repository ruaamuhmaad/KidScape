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

export interface SignUpPayload {
  email: string;
  password: string;
  fullName?: string;
  mobile?: string;
  emergency?: string;
  city?: string;
}

export interface UserProfileDocument {
  uid: string;
  email: string;
  fullName: string;
  displayName: string;
  mobile: string;
  emergency: string;
  city: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const emptySignUpPayload: SignUpPayload = {
  email: '',
  password: '',
  fullName: '',
  mobile: '',
  emergency: '',
  city: '',
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

  return {
    uid: userId,
    email: normalizeEmail(payload.email),
    fullName,
    displayName: fullName,
    mobile: normalizeText(payload.mobile),
    emergency: normalizeText(payload.emergency),
    city: normalizeText(payload.city),
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
    return await signInWithEmailAndPassword(
      getFirebaseAuth(),
      normalizeEmail(email),
      password
    );
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
