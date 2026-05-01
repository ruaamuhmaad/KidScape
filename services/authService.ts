export type {
  SignUpPayload,
  UserProfileDocument,
} from '../firebase/login';
export type { AuthenticatedUserProfile } from '../firebase/userProfile';
export {
  emptySignUpPayload,
  getCurrentUser,
  login,
  logout,
  onUserStateChange,
  resetPassword,
  signUp,
} from '../firebase/login';
export {
  DEFAULT_PARENT_PERMISSIONS,
  DEFAULT_PARENT_ROLE,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from '../firebase/userProfile';
