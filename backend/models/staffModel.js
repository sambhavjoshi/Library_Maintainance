const mongoose = require("mongoose");


const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    maxLength: [30, "Too lengthy for a name"],
    minLength: [3, "Please Enter a longer Name"],
  },
  phone: {
    type: String,
    required: [true, "Please Enter Phone Number"],
  },
  salary:Number,
  lastMonthPaid:String,
  leavesAllowed:{
    type:Number,
    default:18,
  },
  leavesUsed:{
    type:Number,
    default:0,
  },
  qualification:String,
  dateOfJoining:String,
  experience:Number,
  designation:String,
  subject:String,
  documents:[
    {
    public_id:{
        type:String,
        required: true
    },
    url:{
        type:String,
        required: true
    }
}
],
});

module.exports = mongoose.model("Staff", staffSchema);
