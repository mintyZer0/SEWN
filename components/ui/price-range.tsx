export default function PriceRange() {
  return (
    <div className="flex flex-col p-4">
      <h3 className="text-secondary text-2xl">Price</h3>
      <div className="flex flex-row gap-4 ">
        <input
          type="text"
          className="h-10 w-20 bg-gray-300 text-center rounded-md"
        />
        <span className="text-secondary text-2xl">-</span>
        <input
          type="text"
          className="h-10 w-20 bg-gray-300 text-center rounded-md"
        />
      </div>
    </div>
  );
}
