const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.createUser = catchAsyncErrors(async (req, res, next) => {
  req.body.name = req.body.name.toLowerCase();
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    user,
  });
});

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 20;
  const apiFeature = new ApiFeatures(User.find(), req.query).search();
  const users = await apiFeature.query;
  const usersCount = users.length;
  res.status(200).json({
    success: true,
    users,
    usersCount,
    resultPerPage,
  });
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user === null) return next(new ErrorHandler("user not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }

  const user = await User.findById(req.params.id);
  if (user === null) {
    return next(new ErrorHandler("user not found", 404));
  }
  req.body.name = req.body.name.toLowerCase();
  user.phone = req.body.phone;
  user.name = req.body.name;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.paidFine = catchAsyncErrors(async (req, res, next) => {
  const { password, id, number } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }

  const user = await User.findById(id);
  if (user === null) {
    return next(new ErrorHandler("user not found", 404));
  }

  const arr = [];
  user.yetToReturn.forEach((ele) => {
    if (ele.book != number) arr.push(ele);
  });

  user.yetToReturn = arr;
  user.returns = user.returns + 1;

  const book = await Book.findOne({ number });
  await Book.findByIdAndDelete(book._id);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }

  const user = await User.findById(req.params.id);
  if (user === null) {
    return next(new ErrorHandler("user not found", 404));
  }

  if (user.yetToReturn.length > 0) {
    return next(new ErrorHandler("user has not returned all books", 404));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "user deleted successfully",
  });
});


/*
mongodb+srv://degreecollegemodern:modern_college_2013@library.2nzj1wb.mongodb.net/?retryWrites=true&w=majority
*/