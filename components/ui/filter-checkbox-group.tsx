interface FilterCheckBoxGroupProps {
  filterOptions: string[];
}
export default function FilterCheckBoxGroup({
  filterOptions,
}: FilterCheckBoxGroupProps) {
  return (
    <div className="flex flex-col gap-2  flex-1">
      {filterOptions.map((option, index) => (
        <label
          key={index}
          className="flex flex-row items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            className="checkbox bg-primary  checked:border-primary rounded-sm checked:shadow-none"
          />
          <span className="text-2xl text-secondary">{option}</span>
        </label>
      ))}
    </div>
  );
}
