import { Search } from "react-feather";
interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex flex-row w-full bg-primary h-12 sm:h-14 md:h-16 p-2 sm:p-3 rounded-2xl">
      <span className="flex flex-row items-center font-light text-base sm:text-xl md:text-3xl text-white w-auto h-auto gap-2 sm:gap-4 text-center p-2">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        <span className="hidden sm:inline">Search</span>
      </span>
      <form role="search" className="flex flex-1" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search for products..."
          className="flex flex-1 h-auto rounded-2xl bg-white p-2 sm:p-3 md:p-4 text-sm sm:text-base"
        />
      </form>
    </div>
  );
}
