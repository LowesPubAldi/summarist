"use client";

import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="player__nav">
      <div className="player__search">
        <input
          type="text"
          placeholder="Search for books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <HiOutlineSearch />
      </div>
    </div>
  );
}