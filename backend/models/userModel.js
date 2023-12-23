const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    maxLength: [30, "Too lengthy for a name"],
    minLength: [3, "Please Enter a longer Name"],
    unique: [true, "Name already present, please enter a different name"],
  },
  phone: {
    type: String,
    required: [true, "Please Enter Phone Number"],
  },
  yetToReturn: [
    {
      book: {
        type: Number,
      },
      Date: {
        type: Date,
        default: Date.now(),
      },
      issuedBy: {
        type: String,
      },
    },
  ],
  issues:{
    type:Number,
    default:0
  },
  returns:{
    type:Number,
    default:0
  },
});

module.exports = mongoose.model("User", userSchema);
