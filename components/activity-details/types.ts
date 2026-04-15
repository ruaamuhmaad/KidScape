export type ActivityTabName = 'Overview' | 'Details' | 'Costs';

export type OverviewIconName =
  | 'shield-checkmark'
  | 'calendar'
  | 'people'
  | 'football'
  | 'location'
  | 'call';

export type ActivityOverviewItem = {
  icon: OverviewIconName;
  text: string;
};

export type ActivityDetailsInfo = {
  description: string;
  amenities: string[];
  schedule: string;
};

export type ActivityCost = {
  label: string;
  price: string;
  image: string;
};

export type ActivityReview = {
  name: string;
  rating: number;
  comment: string;
};

export type ActivityDetailsRecord = {
  id: string;
  title: string;
  location: string;
  image: string;
  overview: ActivityOverviewItem[];
  details: ActivityDetailsInfo;
  costs: ActivityCost[];
  reviews: ActivityReview[];
};
