import type { AuthenticatedUserProfile } from "@/services/authService";

export type ProfileForm = {
  parentName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emergencyContact: string;
  imageUrl: string;
};

export type ProfileInputKey = Exclude<keyof ProfileForm, "city" | "imageUrl">;

export const EMPTY_PROFILE_FORM: ProfileForm = {
  parentName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  emergencyContact: "",
  imageUrl: "",
};

export const PROFILE_FIELDS: { key: ProfileInputKey; label: string }[] = [
  { key: "parentName", label: "Parent Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "address", label: "Address" },
  { key: "emergencyContact", label: "Emergency Contact" },
];

export const mapProfileToForm = (
  profile: AuthenticatedUserProfile
): ProfileForm => ({
  parentName: profile.PName,
  email: profile.Email,
  phone: profile.Phone,
  address: profile.Address,
  city: profile.City ?? profile.Address.split(",")[0]?.trim() ?? "",
  emergencyContact: profile.EmergencyNumber,
  imageUrl: profile.imageUrl,
});

export const buildProfilePayload = (form: ProfileForm) => ({
  PName: form.parentName,
  imageUrl: form.imageUrl,
  Email: form.email,
  Phone: form.phone,
  Address: form.address,
  EmergencyNumber: form.emergencyContact,
  City: form.city,
});
