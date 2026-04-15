import { doc, getDoc } from 'firebase/firestore';

import { ACTIVITIES } from '@/data/activities';
import { getDb } from '@/firebase';
import type {
  ActivityCost,
  ActivityDetailsInfo,
  ActivityDetailsRecord,
  ActivityOverviewItem,
  ActivityReview,
} from '@/components/activity-details/types';

type ActivitySource = Partial<ActivityDetailsRecord> & {
  imageUrl?: string;
  overview?: Array<Partial<ActivityOverviewItem>>;
  details?: Partial<ActivityDetailsInfo>;
  costs?: Array<Partial<ActivityCost>>;
  reviews?: Array<Partial<ActivityReview>>;
};

const asString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
};

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeOverview = (
  overview: ActivitySource['overview'],
  fallback: ActivityOverviewItem[]
): ActivityOverviewItem[] => {
  if (!Array.isArray(overview) || !overview.length) {
    return fallback;
  }

  return overview.map((item, index) => ({
    icon: fallback[index]?.icon ?? 'location',
    text: asString(item?.text, fallback[index]?.text ?? ''),
  }));
};

const normalizeDetails = (
  details: ActivitySource['details'],
  fallback: ActivityDetailsInfo
): ActivityDetailsInfo => ({
  description: asString(details?.description, fallback.description),
  amenities: Array.isArray(details?.amenities)
    ? details.amenities.map((item) => asString(item))
    : fallback.amenities,
  schedule: asString(details?.schedule, fallback.schedule),
});

const normalizeCosts = (
  costs: ActivitySource['costs'],
  fallback: ActivityCost[]
): ActivityCost[] => {
  if (!Array.isArray(costs) || !costs.length) {
    return fallback;
  }

  return costs.map((cost, index) => ({
    label: asString(cost?.label, fallback[index]?.label ?? ''),
    price: asString(cost?.price, fallback[index]?.price ?? ''),
    image: asString(cost?.image, fallback[index]?.image ?? ''),
  }));
};

const normalizeReviews = (
  reviews: ActivitySource['reviews'],
  fallback: ActivityReview[]
): ActivityReview[] => {
  if (!Array.isArray(reviews) || !reviews.length) {
    return fallback;
  }

  return reviews.map((review, index) => ({
    name: asString(review?.name, fallback[index]?.name ?? ''),
    rating: asNumber(review?.rating, fallback[index]?.rating ?? 0),
    comment: asString(review?.comment, fallback[index]?.comment ?? ''),
  }));
};

export async function getActivityById(id: string): Promise<ActivityDetailsRecord | null> {
  const safeId = String(id).trim();
  const fallbackActivity = ACTIVITIES[safeId as keyof typeof ACTIVITIES] as
    | ActivityDetailsRecord
    | undefined;

  const docRef = doc(getDb(), 'activities', safeId);
  const docSnap = await getDoc(docRef);
  const firestoreData = docSnap.exists() ? (docSnap.data() as ActivitySource) : null;

  const source = firestoreData ?? (fallbackActivity as ActivitySource | undefined);
  if (!source) {
    return null;
  }

  const fallbackDetails = fallbackActivity ?? {
    id: safeId,
    title: '',
    location: '',
    image: '',
    overview: [],
    details: {
      description: '',
      amenities: [],
      schedule: '',
    },
    costs: [],
    reviews: [],
  };

  return {
    id: safeId,
    title: asString(source.title, fallbackDetails.title),
    location: asString(source.location, fallbackDetails.location),
    image: asString(source.image ?? source.imageUrl, fallbackDetails.image),
    overview: normalizeOverview(source.overview, fallbackDetails.overview),
    details: normalizeDetails(source.details, fallbackDetails.details),
    costs: normalizeCosts(source.costs, fallbackDetails.costs),
    reviews: normalizeReviews(source.reviews, fallbackDetails.reviews),
  };
}
