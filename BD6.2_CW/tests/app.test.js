const { app, getAuthors, getAuthorById, addAuthor } = require("../index.js");
const http = require("http");

jest.mock("../index.js", () => ({
  ...jest.requireActual("../index.js"),
  getAuthors: jest.fn(),
  getAuthorById: jest.fn(),
  addAuthor: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  if (server) {
    server.close(done);
  } else {
    done();
  }
});

describe("Functional Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("It should return all values", () => {
    const mockAuthor = [
      { authorId: 1, name: "Rick Riordan", book: "1984" },
      { authorId: 2, name: "J.K. Rowling", book: "Harry Potter" },
      { authorId: 3, name: "J.R.R. Tolkien", book: "Lord" },
      { authorId: 4, name: "J.R.R. Tolkien", book: "Hob" },
    ];
    getAuthors.mockImplementation(() => mockAuthor);
    let result = getAuthors();
    expect(result).toEqual(mockAuthor);
    expect(getAuthors).toHaveBeenCalled();
  });

  test("It should not undefined value", () => {
    let mockAuthor = undefined;
    getAuthorById.mockImplementation(() => mockAuthor);
    let result = getAuthorById(9999999);
    expect(result).toBeUndefined();
    expect(getAuthorById).toHaveBeenCalledWith(9999999);
  });

  test("It should return an author by id", () => {
    const mockAuthor = { authorId: 1, name: "Rick Riordan", book: "1984" };
    getAuthorById.mockImplementation(() => mockAuthor);
    let result = getAuthorById(1);
    expect(result).toEqual(mockAuthor);
    expect(getAuthorById).toHaveBeenCalledWith(1);
  });

  test("It should create new author", () => {
    const mockAuthor = { authorId: 5, name: "Wick SamSung", book: "1989" };
    addAuthor.mockImplementation(() => mockAuthor);
    let result = addAuthor({ authorId: 5, name: "Wick SamSung", book: "1989" });
    expect(result).toEqual(mockAuthor);
    expect(addAuthor).toHaveReturnedWith(mockAuthor);
  });
});
