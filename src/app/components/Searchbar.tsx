"use client";

import { useEffect, useState } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { useRouter } from "next/navigation";

type Book = {
  id: string;
  title: string;
  author?: string;
  imageLink?: string;
};

export default function Searchbar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchBooks() {
      const statuses = ["selected", "recommended", "suggested"];

      const responses = await Promise.all(
        statuses.map((status) =>
          fetch(
            `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`
          )
        )
      );

      const data = await Promise.all(
        responses.map((response) => response.json())
      );

      const allBooks = data.flat();

      setBooks(allBooks);
    }

    fetchBooks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredBooks =
    debouncedSearch.trim().length > 0
      ? books
          .filter((book) => {
            const searchValue = debouncedSearch.toLowerCase();

            return (
              book.title.toLowerCase().includes(searchValue) ||
              book.author?.toLowerCase().includes(searchValue)
            );
          })
          .slice(0, 6)
      : [];
  const handleBookClick = (bookId: string) => {
    setSearch("");
    setIsFocused(false);
    router.push(`/book/${bookId}`);
  };

  return (
    <div className="searchbar__nav">
      <div className="searchbar__search">
        <input
          type="text"
          placeholder="Search for books"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

<div className="searchbar__icon">
       {search ? (
      <button
        type="button"
        className="searchbar__clear"
        aria-label="clear search"
        onClick={() => {
        setSearch("");
        setDebouncedSearch("");
        }}
        >
        <HiOutlineX />
      </button>
        ) : (
      <HiOutlineSearch />
      )}
      </div>

        {isFocused && filteredBooks.length > 0 && (
          <div className="searchbar__dropdown">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="searchbar__dropdown-item"
                onClick={() => handleBookClick(book.id)}
              >
                {book.imageLink && (
                  <img src={book.imageLink} alt={book.title} />
                )}

                <div>
                  <h4>{book.title}</h4>
                  {book.author && <p>{book.author}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}