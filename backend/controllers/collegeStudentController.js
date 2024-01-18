const Admin = require("../models/adminModel");
const Fee = require("../models/feeModel");
const CollegeStudent = require("../models/collegeStudentModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.createCollegeStudent = catchAsyncErrors(async (req, res, next) => {

    console.log("first step of creation")
    req.body.name = req.body.name ? req.body.name.toUpperCase() : undefined;
    req.body.sonOf.name = req.body.sonOf.name ? req.body.sonOf.name.toUpperCase() : undefined;
    req.body.stream = req.body.stream ? req.body.stream.toUpperCase() : undefined;
    req.body.degree = req.body.degree ? req.body.degree.toUpperCase() : undefined;
    const feearr = await Fee.findOne({
        hostel: req.body.hostel,
        stream: req.body.stream,
        degree: req.body.degree,
        semester: req.body.semester
    })

    console.log("student came for creation");
    const fee = feearr.amount;
    req.body.feeLeft = req.body.discounted ? fee - req.body.discounted : fee;
    console.log(req.body);
    req.body.feePayments = {
      amount:0,
      paidBy: "demo payment",
      acceptedBy:"System",
      receiptNo:String(Date.now())
    }
    const collegeStudent = await CollegeStudent.create(req.body);

    console.log("student created");

    res.status(201).json({
      success: true,
      collegeStudent,
    });
  });


  exports.getAllCollegeStudents = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 20;
    const apiFeature = new ApiFeatures(CollegeStudent.find(), req.query).search();
    const collegeStudents = await apiFeature.query;
    const studentsCount = collegeStudents.length;
    res.status(200).json({
      success: true,
      collegeStudents,
      studentsCount,
      resultPerPage,
    });
  });
  
  exports.getCollegeStudent = catchAsyncErrors(async (req, res, next) => {
    const collegeStudent = await CollegeStudent.findById(req.params.id);
    if (collegeStudent === null) return next(new ErrorHandler("student not found", 404));
  
    res.status(200).json({
      success: true,
      collegeStudent,
    });
  });
  
  exports.updateCollegeStudent = catchAsyncErrors(async (req, res, next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }

    const collegeStu = await CollegeStudent.findById(req.params.id);
    if(collegeStu.hostel != req.body.hostel){
      const feearr = await Fee.findOne({
        hostel: req.body.hostel,
        stream: req.body.stream,
        degree: req.body.degree,
        semester: req.body.semester
    })
      
      const fee2 = await Fee.findOne({
        hostel: collegeStu.hostel,
        stream: collegeStu.stream,
        degree: collegeStu.degree,
        semester: collegeStu.semester
    })
  
    const remAmount = feearr.amount - fee2.amount ;
    req.body.feeLeft = collegeStu.feeLeft + remAmount;
    }
  
    await CollegeStudent.findByIdAndUpdate(req.params.id,req.body)
    const collegeStudent = await CollegeStudent.findById(req.params.id);
    res.status(200).json({
      success: true,
      collegeStudent,
    });
  });

  exports.updateSemester = catchAsyncErrors(async(req,res,next)=>{

    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }

    const collegeStu = await CollegeStudent.findById(req.params.id);
    if (collegeStu === null) {
      return next(new ErrorHandler("student not found", 404));
    }

    const feearr = await Fee.findOne({
      hostel: req.body.hostel,
      stream: collegeStu.stream,
      degree: collegeStu.degree,
      semester: req.body.semester
  })

    req.body.feeLeft = feearr.amount + collegeStu.feeLeft - req.body.discount ;
    
    await CollegeStudent.findByIdAndUpdate(req.params.id,req.body)
    const collegeStudent = await CollegeStudent.findById(req.params.id);
    res.status(200).json({
      success: true,
      collegeStudent,
    });
  }) 
  
  exports.payFeeCollege = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
    console.log(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
  
    const collegeStudent = await CollegeStudent.findById(req.params.id);
    if (collegeStudent === null) {
      return next(new ErrorHandler("student not found", 404));
    }
     
    if(req.body.amount <= 0) return next(new ErrorHandler("Make some payment", 400));

    const temp = {
        ...req.body,
        acceptedBy : admin.name
    }

    collegeStudent.feePayments.push(temp);
    collegeStudent.feeLeft -= req.body.amount;
    collegeStudent.feePaid = collegeStudent.feePaid + Number(req.body.amount);
    await collegeStudent.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        collegeStudent
    });
  })

  exports.deleteCollegeStudent = catchAsyncErrors(async (req, res, next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
  
    const collegeStudent = await CollegeStudent.findById(req.params.id);
    if (collegeStudent === null) {
      return next(new ErrorHandler("student not found", 404));
    }
  
    await CollegeStudent.findByIdAndDelete(req.params.id);
  
    res.status(200).json({
      success: true,
      message: "student deleted successfully",
    });
  });
