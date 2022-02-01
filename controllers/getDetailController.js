const mongoose = require('mongoose')
//Initialize express app
var ObjectID = require("mongodb").ObjectID;


const User = require('../model/model')
const shippingAddress = require('../model/ShippingDetailModel')
const purchaseOrder = require('../model/purchaseOrderModel')
const purchaseOrderModel = mongoose.model('purchaseOrder', purchaseOrder)

const customer_byCity = (req,res) =>{
    const city = req.params.city;
console.log(city);
    User.find({city:`${city}`},(err,user)=>{
      res.send(user);
    })
}
const customer_withPO = (req, res) => {
    var userid = new ObjectID("61f81988d196c708df217ea6");
  
    User.aggregate([
      {
        $lookup: {
          from: 'purchaseorders' ,
    localField: 'customerId',
    foreignField: 'customerId',
    as: 'purchaseorders'
        },
      },
    ],function(err,data){
      if(err){
        res.status(400).json({"status":"400","Message":`${err}`});
      }
      else{
        res.send(data);
      }
    })
      // User.find({},{_id:0, 'purchaseorders.purchaseorder' : 1},(err,user)=>{
      //   res.send(user);
      // })
  
  }
const customer_withPOAndSD =(req, res) => {

    User.aggregate([
      {
        $lookup: {
          from: 'purchaseorders' ,
    localField: 'customerId',
    foreignField: 'customerId',
    as: 'purchaseorders'
        },
  
      },{
        $unwind: {
        path: "$purchaseorders",
        preserveNullAndEmptyArrays: true
        }
      },{
        $lookup: {
          from: 'shippingdetails' ,
    localField: 'purchaseorders.purchaseId',
    foreignField: 'purchaseId',
    as: 'purchaseorders.shippingdetails'
        },
      },{
        $group: {
          _id : "$customerId",
          customerName: { $first: "$customerName" },
          email: { $first: "$email" },
          mobileNumber: { $first: "$mobileNumber" },
          customerId: { $first: "$customerId" },
          city: { $first: "$city" },
          purchaseorders: { $push: "$purchaseorders" }
        }
      }, {
        $project: {
          _id: 1,
          customerName: 1,
          email: 1,
          mobileNumber: 1,
          customerId: 1,
          city: 1,
          purchaseorders: {
            $filter: { input: "$purchaseorders", as: "a", cond: { $ifNull: ["$$a._id", false] } }
          } 
        }
      }
    ],function(err,data){
      if(err){
        res.status(400).json({"status":"400","Message":`${err}`});
      }
      else{
        res.send(data);
      }
    })
      // User.find({},{_id:0, 'purchaseorders.purchaseorder' : 1},(err,user)=>{
      //   res.send(user);
      // })
  
  }

module.exports={
    customer_byCity,
    customer_withPO,
    customer_withPOAndSD
}