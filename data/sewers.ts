export interface Sewer {
  id: string;
  name: string;
  bio: string;
  location: string;
  rating: number;
  image: string;
  servicesOffered: ("Repair" | "Alteration" | "Commission")[];
  yearsOfExperience: number;
  productsSewed: number;
  achievements: string[];
  tesdaCertified: boolean;
}

export const sewersData: Sewer[] = [
  {
    id: "1",
    name: "Maria Santos",
    bio: "A dedicated Filipina artisan who blends tradition with modern design. With years of experience in tailoring and garment construction, she has become known for her precision, creativity, and ability to bring unique fashion concepts to life.",
    location: "Manila, NCR",
    rating: 4.8,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["Repair", "Alteration", "Commission"],
    yearsOfExperience: 10,
    productsSewed: 54,
    achievements: [
      "Featured in 3 local fashion showcases in Central Luzon",
      "Delivered 100+ wedding gowns and formal dresses with intricate detailing",
      "Supported 10 capsule collections for online stores and small brands",
    ],
    tesdaCertified: true,
  },
  {
    id: "2",
    name: "Ana Cruz",
    bio: "Modern fashion designer with 10 years experience",
    location: "Cebu, Visayas",
    rating: 4.9,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["Alteration", "Commission"],
    yearsOfExperience: 10,
    productsSewed: 34,
    achievements: [
      "Wedding Gown Specialist Certification",
      "Top Rated Sewer 2024",
    ],
    tesdaCertified: false,
  },
];

export function getSewerById(id: string): Sewer | undefined {
  return sewersData.find((sewer) => sewer.id === id);
}
