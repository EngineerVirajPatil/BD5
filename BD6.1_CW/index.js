import express from "express";
const app = express();
app.use(express.json());
import { getBooks, getBookById, addNewBook } from "./books.js";

app.get("/api/books", (req, res) => {
  res.json(getBooks());
});

app.get("/api/books/:id", (req, res) => {
  let id = parseInt(req.params.id);
  let result = getBookById(id);
  if (result) {
    res.json(result);
  }
});

app.get("/api/addNewBook", () => {
  let newBook = req.body.newBook;
  let result = addNewBook(newBook);
  res.status(201).json(result);
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
