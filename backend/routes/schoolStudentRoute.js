const express = require("express");
const { isAuthUser} = require("../middleware/auth");
const { createSchoolStudent, getAllSchoolStudents, payFeeSchool, getschoolStudent, updateSchoolStudent, deleteSchoolStudent, updateGrade } = require("../controllers/schoolStudentController");


const router = express.Router();

router.route("/schoolStudent/create").post(isAuthUser, createSchoolStudent);
router.route("/schoolStudents").get(isAuthUser, getAllSchoolStudents);
router.route("/schoolStudent/payfee/:id").put(isAuthUser, payFeeSchool);  
router.route("/schoolStudent/updateGrade/:id").put(isAuthUser,updateGrade);
router
  .route("/schoolStudent/:id")
  .get(isAuthUser, getschoolStudent)
  .put(isAuthUser,updateSchoolStudent)
  .post(isAuthUser, deleteSchoolStudent);

module.exports = router;
