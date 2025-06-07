import {
  createBookService,
  deleteBookService,
  getAllBooksService,
  getBookByIdService,
  updateBookService,
} from "../services/book.service.js";
import { ApiResponse } from "../utils/apiRes.util.js";

const createBook = async (req, res) => {
  const bookData = req.body;

  const book = await createBookService(bookData);

  return res
    .status(201)
    .json(new ApiResponse(201, "Book created successfully", book));
};

const getAllBooks = async (req, res) => {
  const { page = 1, limit = 1 } = req.query;
  const { books } = await getAllBooksService(page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, "Books fetched successfully", books));
};

const getBookById = async (req, res) => {
  const bookId = req.params.id;

  const book = await getBookByIdService(bookId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Book fetched successfully", book));
};

const updateBook = async (req, res) => {
  const bookId = req.params.id;
  const bookData = req.body;

  const book = await updateBookService(bookId, bookData);

  return res
    .status(200)
    .json(new ApiResponse(200, "Book updated successfully", book));
};

const deleteBook = async (req, res) => {
  const bookId = req.params.id;

  await deleteBookService(bookId);

  return res.status(204).send();
};

export { createBook, getAllBooks, getBookById, updateBook, deleteBook };
