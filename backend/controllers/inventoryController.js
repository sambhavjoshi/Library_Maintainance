const Admin = require("../models/adminModel");
const Item = require("../models/itemModel")
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


exports.createStock = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
    const item = await Item.create(req.body);
    if(req.body.stock != 0) {
      item.log.push({
        ...req.body,
        category:"ADD",
        totalCost: (req.body.cost)*(req.body.stock),
        approvedBy:admin.name
      })
    }
    
    await item.save({validateBeforeSave:false});    
    
    res.status(201).json({
        success: true,
        item
    });
});  


exports.updateStock = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
    console.log(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
    await Item.findByIdAndUpdate(req.params.id,req.body);
    const item = await Item.findById(req.params.id);
    res.status(201).json({
        success: true,
        item
    });
});  

exports.addToStock = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
    console.log(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
    const item = await Item.findById(req.params.id);
    const newLog = {
        category:"ADD",
        totalCost: req.body.cost * req.body.stock,
        stock:req.body.stock,
        approvedBy:admin.name,
        cost:req.body.cost,
        askedBy:req.body.askedBy,
        date:Date.now()
    }
    item.stock += Number(req.body.stock);
    item.log.push(newLog);
    item.cost = Math.max(item.cost,req.body.cost);
    await item.save({ validateBeforeSave: false });
    res.status(201).json({
        success: true,
        item
    });
});  


exports.removeFromStock = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
    console.log(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
    const item = await Item.findById(req.params.id);
    const newLog = {
        category:"REMOVE",
     //   totalCost: req.body.cost * req.body.stock,
        stock:req.body.stock,
        approvedBy:admin.name,
        cost:item.cost,
        totalCost:item.cost*req.body.stock,
        askedBy:req.body.askedBy,
       // cost:req.body.cost,
    }
    item.stock = Math.max(item.stock - req.body.stock,0);
    item.log.push(newLog);
    await item.save({ validateBeforeSave: false });
    res.status(201).json({
        success: true,
        item
    });
});  

exports.deleteStock = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
    console.log(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
    await Item.findByIdAndDelete(req.params.id);
    res.status(201).json({
        success: true,
    });
});  


exports.getStock = catchAsyncErrors(async(req,res,next) => {
    const item = await Item.findById(req.params.id);
    res.status(201).json({
        success: true,
        item
    });
});  

exports.getAllStocks = catchAsyncErrors(async(req,res,next) => {
  const resultPerPage = 20;
  const keyword = {
    name: {
      $regex: req.query.name,
      $options: "i", // makes it case insensitive
    },
    lab:{
      $regex: req.query.lab,
      $options:"i",
    }
  };
  const items = await Item.find(keyword);
  const itemsCount = items.length;
  res.status(200).json({
    success: true,
    items,
    itemsCount,
    resultPerPage,
  });
});

