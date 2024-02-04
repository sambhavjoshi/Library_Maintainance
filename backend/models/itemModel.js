const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  stock: Number,
  damaged:{
    type:Number,
    default:0,
  },
  lab:String,
  log: [
    {
      category: String,
      stock: Number,
      date: {
        type: Date,
      },
      cost: Number,
      approvedBy: String,
      totalCost: Number,
      askedBy:String,
    },
  ],
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
