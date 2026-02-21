import { Search } from "react-feather";
export default function SearchBar() {
  return (
    <div className="relative flex flex-row w-full bg-[#7B3B7B] h-16 p-3 rounded-2xl">
      <span className="flex flex-row items-center  font-light text-3xl text-white w-auto h-auto gap-4 text-center p-2">
        <Search />
        Search
      </span>
      <form role="search" className="flex flex-1">
        <input
          type="search"
          className="flex flex-1 h-auto rounded-2xl bg-white p-4"
        />
      </form>
    </div>
  );
}
