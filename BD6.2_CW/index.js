const express = require("express");
const app = express();
app.use(express.json());

let authors = [
  { authorId: 1, name: "Rick Riordan", book: "1984" },
  { authorId: 2, name: "J.K. Rowling", book: "Harry Potter" },
  { authorId: 3, name: "J.R.R. Tolkien", book: "Lord" },
  { authorId: 4, name: "J.R.R. Tolkien", book: "Hob" },
];

function getAuthors() {
  return authors;
}

function getAuthorById(id) {
  return authors.find((author) => author.authorId === id);
}
function addAuthor(author) {
  authors.push(author);
}

app.get("/authors", (req, res) => {
  let authors = getAuthors();
  res.status(200).json(authors);
});

app.get("/authors/:authorId", (req, res) => {
  let id = parseInt(req.params.authorId);
  let author = getAuthorById(id);
  res.status(200).json(author);
});

app.post("/authors", (req, res) => {
  let newBook = req.body.newAuthor;
  let result = addAuthor(newBook);
  res.status(200).json(result);
});

module.exports = { getAuthors, getAuthorById, addAuthor };
