import { Search } from "react-feather";
export default function SearchBar() {
  return (
    <div className="relative flex flex-row w-full bg-primary-light h-16 p-3 rounded-2xl gap-2">
      <span className="flex flex-row items-center text-2xl w-30 gap-4 text-center p-2">
        <Search />
        Search
      </span>
      <form role="search" className="flex flex-1">
        <input
          type="search"
          className="flex flex-1 h-auto bg-gray-300 rounded-2xl"
        />
      </form>
    </div>
  );
}
