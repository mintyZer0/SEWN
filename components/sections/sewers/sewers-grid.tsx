import SewerCard from "./sewer-card";
import { sewersData } from "@/data/sewers";

export default function SewersGrid() {
  return (
    <div className="w-full p-2">
      <div className="flex justify-between ">
        <span className=" text-2xl mx-5">{sewersData.length} Sewers</span>
        <div className="mb-4 mx-4">
          <select className="px-4 py-2 bg-primary-light rounded-lg border-none text-lg">
            <option>Filter by most sold</option>
            <option>Highest rated</option>
            <option>Most experienced</option>
            <option>Location</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto">
        {sewersData.map((sewer) => (
          <SewerCard
            key={sewer.id}
            id={sewer.id}
            name={sewer.name}
            image={sewer.image}
            location={sewer.location}
            yearsOfExperience={sewer.yearsOfExperience}
            servicesOffered={sewer.servicesOffered}
            rating={sewer.rating}
          />
        ))}
      </div>
    </div>
  );
}
