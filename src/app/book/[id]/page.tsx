import Sidebar from "@/app/components/Sidebar";
import { HiOutlineSearch } from "react-icons/hi";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  console.log("id:", id);

  const response = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
  );

  const text = await response.text();

console.log("status:", response.status);
console.log("text:", text);

if (!text) {
  throw new Error("API returned empty text");
}

const book = JSON.parse(text);

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
              <div>⭐ {book.averageRating} ({book.totalRating} ratings)</div>
              <div>⏱ {book.audioLength}</div>
              <div>🎙 Audio & Text</div>
              <div>💡 {book.keyIdeas} Key ideas</div>
            </div>

            <div className="book__buttons">
              <button>Read</button>
              <button>Listen</button>
            </div>

            <p className="book__library">🔖 Add title to My Library</p>
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