const Book = require("../models/bookModel");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.createBook = catchAsyncErrors(async (req, res, next) => {
  req.body.name = req.body.name.toLowerCase();
  const book = await Book.create(req.body);
  res.status(201).json({
    success: true,
    book,
  });
});

exports.updateBook = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }
  let book = Book.findById(req.params.id);

  if (!book)
    return res.status(500).json({
      success: false,
      message: "book not found",
    });

  book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    book,
  });
});

exports.getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 20;
  const apiFeature = new ApiFeatures(Book.find(), req.query).search();
  const books = await apiFeature.query;
  const booksCount = books.length;
  res.status(200).json({
    success: true,
    books,
    booksCount,
    resultPerPage,
  });
});

exports.getBook = catchAsyncErrors(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (book === null) return next(new ErrorHandler("book not found", 404));

  res.status(200).json({
    success: true,
    book,
  });
});

exports.bookWithdraw = catchAsyncErrors(async (req, res, next) => {
  const { password, number, borrower } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }
  const user = await User.findOne({ name: borrower });
  if (user === null) return next(new ErrorHandler("username not found", 404));
  const book = await Book.findOne({ number });
  if (book === null) return next(new ErrorHandler("book not found", 404));
  if (book.bookWith !== "library")
    return next(new ErrorHandler("book not with library", 404));

  book.bookWith = borrower;
  book.lastGiver = admin.name;
  book.lastIssuedOn = Date.now();
  const temp = {
    book: number,
    issuedBy: admin.name,
  };
  user.yetToReturn.push(temp);
  user.issues = user.issues + 1;

  await book.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    book,
    user,
  });
});

exports.bookReturn = catchAsyncErrors(async (req, res, next) => {
  const { password, number, returner } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }
  const user = await User.findOne({ name: returner });
  if (user === null) return next(new ErrorHandler("username not found", 404));
  const book = await Book.findOne({ number });
  if (book === null) return next(new ErrorHandler("book not found", 404));
  if (book.bookWith === "library")
    return next(new ErrorHandler("book already returned", 400));

  let temp = false;
  const arr = [];
  user.yetToReturn.forEach((ele) => {
    if (ele.book == number) {
      temp = true;
    } else arr.push(ele);
  });
  if (temp === false) {
    return next(new ErrorHandler("book not issued by this user", 404));
  }
  book.bookWith = "library";
  book.lastAcceptor = admin.name;

  user.yetToReturn = arr;
  user.returns = user.returns + 1;

  await book.save({ validateBeforeSave: false });
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    book,
    user,
  });
});

exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }

  const book = await Book.findById(req.params.id);
  if (book === null) {
    return next(new ErrorHandler("book not found", 404));
  }

  if (book.bookWith !== "library")
    return next(new ErrorHandler("book is yet to be returned", 404));

  await Book.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
