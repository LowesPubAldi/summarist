"use client";

import Sidebar from "@/app/components/Sidebar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { BsBookmark } from "react-icons/bs";

export default function BookPage() {
  const [book, setBook] = useState<any>(null);
  const params = useParams();
  const id = params.id;

 useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(
      `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
    );

    console.log("status:", response.status);
    console.log("ok:", response.ok);

    const text = await response.text();
    console.log("text:", text);

    if (!text) {
      console.log("API returned empty response");
      return;
    }

    const data = JSON.parse(text);
    setBook(data);
  };

  fetchData();
}, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book">
      <Sidebar />
      <main className="book__content">
        <div className="book__nav">
          <div className="book__search">
            <input type="text" placeholder="Search for books" />
            <HiOutlineSearch />
          </div>
        </div>

        <section className="book__hero">
          <div className="book__details">
            <h1>{book.title}</h1>
            <p>{book.author}</p>
            <h2>{book.subTitle}</h2>

            <div className="book__stats">
              <div>
                ⭐ {book.averageRating} ({book.totalRating} ratings)
              </div>
              <div>⏱ {book.audioLength}</div>
              <div>🎙 Audio & Text</div>
              <div>💡 {book.keyIdeas} Key ideas</div>
            </div>

            <div className="book__buttons">
              <button>Read</button>
              <button>Listen</button>
            </div>

            <p className="book__library">
                <BsBookmark /> Add title to My Library
                </p>
          </div>

          <figure className="book__image--wrapper">
            <img src={book.imageLink} alt={book.title} />
          </figure>
        </section>

        <section className="book__about">
          <h3>What's it about?</h3>
          <div className="book__tags">
            {book.tags?.map((tag: string) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <p>{book.bookDescription}</p>

          <h3>About the author</h3>
          <p>{book.authorDescription}</p>
        </section>
      </main>
    </div>
  );
}
