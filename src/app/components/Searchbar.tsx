"use client";

import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) return;
  }, [debouncedSearch]);

  return (
    <div className="searchbar__nav">
      <div className="searchbar__search">
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