interface StatsCardProps {
  yearsOfExperience: number;
  rating: number;
  productsSewed: number;
}

export default function StatsCard({
  yearsOfExperience,
  rating,
  productsSewed,
}: StatsCardProps) {
  return (
    <div className="flex w-full bg-secondary-gradient-b py-20 px-8 justify-center items-center">
      <div className="grid grid-cols-2 gap-x-50 gap-y-12 max-w-4xl">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl text-primary-dark mb-2">
            Years of Experience
          </h3>
          <p className="text-6xl font-semibold text-primary-dark">
            {yearsOfExperience}+
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-2xl text-primary-dark mb-2">
            Customer Satisfaction
          </h3>
          <p className="text-6xl font-semibold text-primary-dark">{rating}</p>
        </div>
        <div className="flex flex-col items-center col-span-2">
          <h3 className="text-2xl text-primary-dark mb-2">Products Sewed</h3>
          <p className="text-6xl font-semibold text-primary-dark">
            {productsSewed}
          </p>
        </div>
      </div>
    </div>
  );
}
