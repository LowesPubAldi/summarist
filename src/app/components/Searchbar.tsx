import { HiOutlineSearch } from "react-icons/hi";

export default function Searchbar() {
  return (
    <div className="player__nav">
      <div className="player__search">
        <input
          type="text"
          placeholder="Search for books"
        />
        <HiOutlineSearch />
      </div>
    </div>
  );
}