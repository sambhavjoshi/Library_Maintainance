const express = require("express");
const { isAuthUser} = require("../middleware/auth");
const { createCollegeStudent, getAllCollegeStudents, payFeeCollege, getCollegeStudent, updateCollegeStudent, deleteCollegeStudent } = require("../controllers/collegeStudentController");



const router = express.Router();

router.route("/collegeStudent/create").post(isAuthUser, createCollegeStudent);
router.route("/collegeStudents").get(isAuthUser, getAllCollegeStudents);
router.route("/collegeStudent/payfee/:id").put(isAuthUser, payFeeCollege);  
router
  .route("/collegeStudent/:id")
  .get(isAuthUser, getCollegeStudent)
  .put(isAuthUser,updateCollegeStudent)
  .post(isAuthUser, deleteCollegeStudent);

module.exports = router;