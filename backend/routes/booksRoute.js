const express = require("express");
const { isAuthUser } = require("../middleware/auth");
const {
  createBook,
  getAllBooks,
  getBook,
  bookWithdraw,
  bookReturn,
  deleteBook,
  updateBook,
} = require("../controllers/bookController");
const router = express.Router();

router.route("/books").get(getAllBooks);
router.route("/book/new").post(isAuthUser, createBook);
router.route("/book/withdraw").put(isAuthUser, bookWithdraw);
router.route("/book/return").put(isAuthUser, bookReturn);
router
  .route("/book/:id")
  .get(getBook)
  .put(isAuthUser, updateBook)
  .post(isAuthUser, deleteBook); // alag se route banake delete likhna bhi same hai

module.exports = router;
