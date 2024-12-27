let books = [
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
];

function getBooks() {
  return books;
}

function getBookById(id) {
  let book = books.find((book) => book.id === id);
  return book;
}

function addNewBook(newBook) {
  let id = books.length + 1;
  let newBookWithId = {
    id: id,
    ...newBook,
  };
  books.push(newBookWithId);
  return newBookWithId;
}

exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.addNewBook = addNewBook;
