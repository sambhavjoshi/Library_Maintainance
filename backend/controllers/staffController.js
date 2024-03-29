const Admin = require("../models/adminModel");
const Staff = require("../models/staffModel");
const Misc = require("../models/miscModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

exports.createStaff = catchAsyncErrors(async (req, res, next) => {

    const { password } = req.body;
    const admin = await Admin.findById(req.user.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Password is Incorrect", 400));
    }

    req.body.name = req.body.name ? req.body.name.toUpperCase() : undefined;
    req.body.designation = req.body.designation ? req.body.designation.toUpperCase() : undefined;
    req.body.subject = req.body.subject ? req.body.subject.toUpperCase() : undefined;
    req.body.qualification = req.body.qualification ? req.body.qualification.toLowerCase() : undefined;
    req.body.lastMonthPaid = req.body.dateOfJoining;
    
    if(req.body.images != null) {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
   
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "staff Documents"
      });
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.documents = imagesLinks;
    }
    const staff = await Staff.create(req.body);

    res.status(201).json({
      success: true,
      staff,
    });
  });

exports.getAllStaff = catchAsyncErrors(async(req,res,next) => {
   const apiFeature = new ApiFeatures(Staff.find(),req.query).search();
   const staffs = await apiFeature.query;
   const staffsCount = staffs.length;
   res.status(200).json({
      success: true,
      staffs,
      staffsCount,
   });
 });

exports.getStaffDetails = catchAsyncErrors(async(req,res,next) => {
     const staff = await Staff.findById(req.params.id);
     if(staff === null) return next(new ErrorHandler("Staff not found",404));
     res.status(200).json({
      success:true,
      staff,
     });
}); 

exports.deleteStaff = catchAsyncErrors(async(req,res,next) => {
     const { password } = req.body;
     const admin = await Admin.findById(req.user.id).select("+password");
     const isPasswordMatched = await admin.comparePassword(password);

     if (!isPasswordMatched) {
       return next(new ErrorHandler("Password is Incorrect", 400));
     }

     const staff = await Staff.findById(req.params.id);
     if(staff === null) return next(new ErrorHandler("Staff not found",404));

     await Staff.findByIdAndDelete(req.params.id);
     
     res.status(200).json({
      success:true,
      message:"staff removed successfully"
     })
})

exports.updateStaff = catchAsyncErrors(async(req,res,next) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }

  const staf = await Staff.findById(req.params.id);
  if(staf === null) return next(new ErrorHandler("staff not found",404));
  if(req.body.images != null){
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
 
  const imagesLinks = staf.documents;

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "staff Documents"
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.documents = imagesLinks;
  }
  if(staf.lastMonthPaid == null) req.body.lastMonthPaid = req.body.salaryClearedTill ? req.body.salaryClearedTill : null;
  else if(req.body.salaryClearedTill != null){
       const date1 = new Date(req.body.salaryClearedTill);
       const date2 = new Date(staf.lastMonthPaid);
       
       if(date1 > date2) {
        req.body.lastMonthPaid = req.body.salaryClearedTill;
        req.body.deductionLeaves=0;
       }
  }
  const leaves = staf.leavesUsed;
  if(req.body.leavesUsed && req.body.leavesUsed > leaves){
    if(req.body.leavesUsed > staf.leavesAllowed ) req.body.deductionLeaves = staf.deductionLeaves + 1;
  }
  const staff = await Staff.findByIdAndUpdate(req.params.id,req.body);
  
  res.status(200).json({
    success:true,
    staff,
  })
})


exports.refreshLeaves = catchAsyncErrors(async(req,res,next) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.user.id).select("+password");
  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }
  const staffs = await Staff.find();

  staffs.forEach(async(staff) => {
    const updatedStaff = await Staff.findByIdAndUpdate(staff._id,{
      leavesUsed : 0,
    },{
      new: true,
      runValidators: true,
      useFindAndModify: false,
    })
  })

  const current = await Misc.findOne({name:"sambhav"});
  await Misc.findByIdAndUpdate(current._id,{ongoingYear:current.ongoingYear+1},{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  },)

  
  res.status(200).json({
    success:true,
    message:"Staffs updated successfully"
  })
})


exports.getCurrentYear = catchAsyncErrors(async(req,res,next) => {
    const current = await Misc.findOne({name:"sambhav"});
  
  res.status(200).json({
    success:true,
    currentYear:current.ongoingYear,
  })
})
