import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';

import { getDb, getFirebaseAuth } from './config';

export const CLOUDINARY_CLOUD_NAME = 'dvdsw6sys';
export const CLOUDINARY_UPLOAD_PRESET = 'profile image';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

type SaveImageUrlOptions = {
  collectionName: string;
  documentId: string;
  imageUrl: string;
  fieldName?: string;
  extraData?: Record<string, unknown>;
};

const readFileExtension = (uri: string, mimeType?: string | null): string => {
  const mimeExtension = mimeType?.split('/')[1]?.split(';')[0]?.trim();

  if (mimeExtension) {
    return mimeExtension === 'jpeg' ? 'jpg' : mimeExtension;
  }

  const uriExtension = uri.split('?')[0]?.split('.').pop()?.trim();

  return uriExtension || 'jpg';
};

const readFileName = (
  asset: Pick<ImagePicker.ImagePickerAsset, 'fileName' | 'mimeType' | 'uri'>
): string => {
  if (asset.fileName) {
    return asset.fileName;
  }

  return `profile-image-${Date.now()}.${readFileExtension(
    asset.uri,
    asset.mimeType
  )}`;
};

export const pickImageFromGallery =
  async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      throw new Error('Please allow photo library access to choose an image.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    return result.assets[0];
  };

export const takePhotoWithCamera =
  async (): Promise<ImagePicker.ImagePickerAsset | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      throw new Error('Please allow camera access to take a photo.');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.length) {
      return null;
    }

    return result.assets[0];
  };

export const uploadImageToCloudinary = async (
  asset: Pick<
    ImagePicker.ImagePickerAsset,
    'file' | 'fileName' | 'mimeType' | 'uri'
  >
): Promise<string> => {
  const formData = new FormData();
  const mimeType = asset.mimeType || 'image/jpeg';

  if (asset.file) {
    formData.append('file', asset.file);
  } else {
    formData.append('file', {
      uri: asset.uri,
      type: mimeType,
      name: readFileName(asset),
    } as unknown as Blob);
  }

  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });
  const payload = (await response.json().catch(() => ({}))) as CloudinaryUploadResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message || `Cloudinary upload failed (${response.status}).`
    );
  }

  if (!payload.secure_url) {
    throw new Error('Cloudinary did not return a secure image URL.');
  }

  return payload.secure_url;
};

export const saveImageUrlToFirestore = async ({
  collectionName,
  documentId,
  imageUrl,
  fieldName = 'imageUrl',
  extraData = {},
}: SaveImageUrlOptions): Promise<void> => {
  const normalizedUrl = imageUrl.trim();

  if (!normalizedUrl) {
    throw new Error('Cannot save an empty image URL.');
  }

  await setDoc(
    doc(getDb(), collectionName, documentId),
    {
      ...extraData,
      [fieldName]: normalizedUrl,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
};

export const saveCurrentUserProfileImageUrl = async (
  imageUrl: string
): Promise<void> => {
  const auth = getFirebaseAuth();

  await auth.authStateReady();

  const user = auth.currentUser;

  if (!user) {
    throw new Error('Please log in to save your profile photo.');
  }

  await saveImageUrlToFirestore({
    collectionName: 'users',
    documentId: user.uid,
    imageUrl,
    extraData: {
      uid: user.uid,
      photoURL: imageUrl,
    },
  });

  if (user.photoURL !== imageUrl) {
    await updateProfile(user, { photoURL: imageUrl });
  }
};

export const uploadCurrentUserProfileImage = async (
  uri: string,
  mimeType?: string | null,
  _base64?: string | null
): Promise<string> => {
  return uploadImageToCloudinary({
    uri,
    mimeType: mimeType || undefined,
    fileName: null,
  });
};

export const uploadAndSaveCurrentUserProfileImage = async (
  asset: ImagePicker.ImagePickerAsset
): Promise<string> => {
  const secureUrl = await uploadImageToCloudinary(asset);
  await saveCurrentUserProfileImageUrl(secureUrl);

  return secureUrl;
};
