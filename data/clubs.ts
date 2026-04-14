export type Club = {
  id: string;
  title: string;
  details: string;
  rating: string;
  imageUrl: string;
  description: string;
  location: string;
  phone: string;
};

export const CLUBS: Record<string, Club> = {
  "1": {
    id: "1",
    title: "Youth of Tomorrow Organization",
    details: "Nablus - All activities",
    rating: "4.5",
    imageUrl: "https://i.pinimg.com/736x/06/66/98/0666982525812d60b419307d7415c689.jpg",
    description:
      "A community-focused organization offering a wide range of youth activities, sports, and educational programs for children and families.",
    location: "Nablus - All activities",
    phone: "059-000-0000",
  },
  "2": {
    id: "2",
    title: "Equestrian Club",
    details: "Jenin - Horse riding activity",
    rating: "2.5",
    imageUrl: "https://tse3.mm.bing.net/th/id/OIP.8sbfZ6kHdiT5y5-2d_G4AgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
    description:
      "A specialized equestrian center in Jenin providing horse riding lessons and outdoor activity experiences for children and families.",
    location: "Jenin - Horse riding activity",
    phone: "059-111-2222",
  },
};
