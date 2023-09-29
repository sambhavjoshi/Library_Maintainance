const express = require("express");
const { isAuthUser} = require("../middleware/auth");
const {
  createUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  paidFine,
} = require("../controllers/userController");
const router = express.Router();

router.route("/user/register").post(isAuthUser, createUser);
router.route("/users").get(isAuthUser, getAllUsers);
router.route("/user/payfine").put(isAuthUser, paidFine);  
router
  .route("/user/:id")
  .get(isAuthUser, getUser)
  .put(isAuthUser,updateUser)
  .post(isAuthUser, deleteUser);

module.exports = router;
