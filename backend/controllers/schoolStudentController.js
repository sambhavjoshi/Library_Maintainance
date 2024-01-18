const Admin = require("../models/adminModel");
const Fee = require("../models/feeModel");
const SchoolStudent = require("../models/schoolStudentModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

exports.createSchoolStudent = catchAsyncErrors(async (req, res, next) => {
    req.body.name = req.body.name ? req.body.name.toUpperCase() : undefined;
    req.body.sonOf.name = req.body.sonOf.name ? req.body.sonOf.name.toUpperCase() : undefined;
    req.body.stream = req.body.stream ? req.body.stream.toUpperCase() : undefined;
    const feearr = await Fee.findOne({
        hostel: req.body.hostel,
        stream: req.body.stream,
        grade: req.body.grade
    })
    const fee = feearr.amount;
    req.body.feeLeft = req.body.discounted ? fee - req.body.discounted : fee;
    req.body.feePayments = {
      amount:0,
      paidBy: "demo payment",
      acceptedBy:"System",
      receiptNo:String(Date.now())
    }

    const schoolStudent = await SchoolStudent.create(req.body);

    res.status(201).json({
      success: true,
      schoolStudent,
    });
  });


  exports.getAllSchoolStudents = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 20;
    const apiFeature = new ApiFeatures(SchoolStudent.find(), req.query).search();
    const schoolStudents = await apiFeature.query;
    const studentsCount = schoolStudents.length;
    res.status(200).json({
      success: true,
      schoolStudents,
      studentsCount,
      resultPerPage,
    });
  });
  
  exports.getschoolStudent = catchAsyncErrors(async (req, res, next) => {
    const schoolStudent = await SchoolStudent.findById(req.params.id);
    if (schoolStudent === null) return next(new ErrorHandler("student not found", 404));
  
    res.status(200).json({
      success: true,
      schoolStudent,
    });
  });
  
  exports.updateSchoolStudent = catchAsyncErrors(async (req, res, next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
  
    const schoolStu = await SchoolStudent.findById(req.params.id);
    if (schoolStu === null) {
      return next(new ErrorHandler("student not found", 404));
    }

    const feearr = await Fee.findOne({
      hostel: req.body.hostel,
      stream: req.body.stream,
      grade: req.body.grade
  })
    
    const fee2 = await Fee.findOne({
      hostel: schoolStu.hostel,
      stream: schoolStu.stream,
      grade: schoolStu.grade
    })

    const remAmount = feearr.amount - fee2.amount ; 
    req.body.name = req.body.name ? req.body.name.toUpperCase() : undefined;
    req.body.sonOf.name = req.body.sonOf.name ? req.body.sonOf.name.toUpperCase() : undefined;
    req.body.stream = req.body.stream ? req.body.stream.toUpperCase() : undefined;
    if(req.body.grade !== schoolStu.grade ) {
      req.body.feeLeft = feearr.amount + schoolStu.feeLeft ;
    }
    else{
      req.body.feeLeft = schoolStu.feeLeft + remAmount ; 
    }
    await SchoolStudent.findByIdAndUpdate(req.params.id,req.body);
    const schoolStudent = await SchoolStudent.findById(req.params.id);
  
    res.status(200).json({
      success: true,
      schoolStudent,
    });
  });


  exports.updateGrade = catchAsyncErrors(async(req,res,next)=>{

    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }

    const schoolStu = await SchoolStudent.findById(req.params.id);
    if (schoolStu === null) {
      return next(new ErrorHandler("student not found", 404));
    }

    const feearr = await Fee.findOne({
      hostel: req.body.hostel,
      stream: schoolStu.stream,
      grade: req.body.grade
  })

    req.body.feeLeft = feearr.amount + schoolStu.feeLeft - req.body.discount ;
    
    await SchoolStudent.findByIdAndUpdate(req.params.id,req.body)
    const schoolStudent = await SchoolStudent.findById(req.params.id);
    res.status(200).json({
      success: true,
      schoolStudent,
    });
  }) 
  
  
  exports.payFeeSchool = catchAsyncErrors(async(req,res,next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
  
    const schoolStudent = await SchoolStudent.findById(req.params.id);
    if (schoolStudent === null) {
      return next(new ErrorHandler("student not found", 404));
    }
    if(req.body.amount <= 0) return next(new ErrorHandler("Make some payment", 400));

    const temp = {
        ...req.body,
        acceptedBy : admin.name
    }

    schoolStudent.feePayments.push(temp);
    schoolStudent.feeLeft -= req.body.amount;
    schoolStudent.feePaid += Number(req.body.amount);
    await schoolStudent.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        schoolStudent
    });
  })

  exports.deleteSchoolStudent = catchAsyncErrors(async (req, res, next) => {
    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }
  
    const schoolStudent = await SchoolStudent.findById(req.params.id);
    if (schoolStudent === null) {
      return next(new ErrorHandler("student not found", 404));
    }
  
    await SchoolStudent.findByIdAndDelete(req.params.id);
  
    res.status(200).json({
      success: true,
      message: "student deleted successfully",
    });
  });
