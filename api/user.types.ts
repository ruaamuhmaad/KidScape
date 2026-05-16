export type UserId = number | string;

export type UserProfile = {
  id: string;
  PName: string;
  imageUrl: string;
  Email: string;
  Phone: string;
  Address: string;
  EmergencyNumber: string;
  ChildName?: string;
  City?: string;
};

export type UserProfileDraft = Partial<UserProfile>;

export type UpdateUserPayload = Omit<UserProfile, "id">;
