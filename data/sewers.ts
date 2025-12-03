export interface Sewer {
  id: string;
  name: string;
  bio: string;
  location: string;
  rating: number;
  image: string;
  servicesOffered: ("repair" | "alteration" | "commission")[];
  yearsOfExperience: number;
  productsSewed: number;
  achievements: string[];
  tesdaCertified: boolean;
  mobileNumber: string;
  email: string;
}

export const sewersData: Sewer[] = [
  {
    id: "1",
    name: "Maria Santos",
    bio: "A dedicated Filipina artisan who blends tradition with modern design. With years of experience in tailoring and garment construction, she has become known for her precision, creativity, and ability to bring unique fashion concepts to life.",
    location: "Tarlac City, Philippines",
    rating: 4.8,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["repair", "alteration", "commission"],
    yearsOfExperience: 10,
    productsSewed: 54,
    achievements: [
      "Featured in 3 local fashion showcases in Central Luzon",
      "Delivered 100+ wedding gowns and formal dresses with intricate detailing",
      "Supported 10 capsule collections for online stores and small brands",
    ],
    tesdaCertified: true,
    mobileNumber: "+63 917 123 4567",
    email: "maria.santos@gmail.com",
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
    mobileNumber: "+63 932 456 7890",
    email: "ana.cruz@gmail.com",
  },
  {
    id: "3",
    name: "Rosa Dela Cruz",
    bio: "Specializes in traditional Filipiniana and modern formal wear with over 15 years of experience in creating custom garments.",
    location: "Manila, Metro Manila",
    rating: 4.7,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["commission", "alteration"],
    yearsOfExperience: 15,
    productsSewed: 89,
    achievements: [
      "Filipiniana expert with 200+ custom barong and terno orders",
      "Participated in Manila Fashion Week 2023",
    ],
    tesdaCertified: true,
    mobileNumber: "+63 915 234 5678",
    email: "rosa.delacruz@gmail.com",
  },
  {
    id: "4",
    name: "Linda Reyes",
    bio: "Expert in garment repair and alterations, providing quick turnaround times without compromising quality.",
    location: "Davao City, Mindanao",
    rating: 4.6,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["repair", "alteration"],
    yearsOfExperience: 8,
    productsSewed: 120,
    achievements: [
      "Fast service specialist with 500+ repairs completed",
      "Community choice award 2023",
    ],
    tesdaCertified: true,
    mobileNumber: "+63 928 345 6789",
    email: "linda.reyes@gmail.com",
  },
  {
    id: "5",
    name: "Carmen Flores",
    bio: "Passionate about sustainable fashion and upcycling old garments into modern pieces.",
    location: "Baguio City, Cordillera",
    rating: 4.8,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["commission", "repair", "alteration"],
    yearsOfExperience: 12,
    productsSewed: 67,
    achievements: [
      "Eco-fashion advocate with 100+ upcycled projects",
      "Featured in sustainable fashion magazine",
    ],
    tesdaCertified: false,
    mobileNumber: "+63 919 456 7890",
    email: "carmen.flores@gmail.com",
  },
  {
    id: "6",
    name: "Elena Mendoza",
    bio: "Bridal and occasion wear specialist creating dream dresses for special moments.",
    location: "Iloilo City, Visayas",
    rating: 4.9,
    image: "/assets/sewer-photos/1.png",
    servicesOffered: ["commission"],
    yearsOfExperience: 18,
    productsSewed: 156,
    achievements: [
      "300+ bridal gowns and debut dresses",
      "Best bridal couture designer Visayas 2022",
    ],
    tesdaCertified: true,
    mobileNumber: "+63 920 567 8901",
    email: "elena.mendoza@gmail.com",
  },
];

export function getSewerById(id: string): Sewer | undefined {
  return sewersData.find((sewer) => sewer.id === id);
}
