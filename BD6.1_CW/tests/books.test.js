const { getBooks, getBookById, addNewBook } = require("../books.js");

describe("Books Function", () => {
  it("it should run all books", () => {
    let books = getBooks();
    expect(books.length).toBe(4);
    expect(books).toEqual([
      {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
      },
      {
        id: 2,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
      },
      {
        id: 3,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
      },
      {
        id: 4,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
      },
    ]);
  });

  it("it should return a book by id", () => {
    let book = getBookById(1);
    expect(book.id).toBe(1);
    expect(book.title).toBe("The Alchemist");
    expect(book.author).toBe("Paulo Coelho");
  });

  it("it should return an error if the book is not found", () => {
    let book = getBookById(99);
    expect(book).toBe(undefined);
  });

  it("it should add a new book", () => {
    let addNew = {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
    };
    let newBook = addNewBook(addNew);
    expect(newBook).toEqual({
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
    });

    let books = getBooks();
    expect(books.length).toBe(5);
    expect(books[4]).toEqual(newBook);
  });
});
