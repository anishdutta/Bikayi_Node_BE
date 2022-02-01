const mongoose = require('mongoose')
//Initialize express app
var ObjectID = require("mongodb").ObjectID;


const User = require('../model/model')
const shippingAddress = require('../model/ShippingDetailModel')
const purchaseOrder = require('../model/purchaseOrderModel')
const purchaseOrderModel = mongoose.model('purchaseOrder', purchaseOrder)

const user_addDetail = (req, res) => {
    const {customerName, email, mobileNumber, city} = req.body;
    console.log(customerName);
   let newUser = new User({
    customerName: customerName,
     email: email,
     mobileNumber: mobileNumber,
     city: city
    })
    newUser.save().then((User) => {
     res.send(User)
    }).catch((err) => {
     console.log(err)
     res.status(400).send(err);
    })
}

const user_purchaseOrder = (req, res) => {
    const {productName, Quantity, Pricing, MRP,customerId} = req.body;
    console.log(Pricing > MRP,Pricing+MRP);

    if(Pricing < MRP){
      var userid = ObjectID(`${customerId}`);

      let newPurchaseOrder = new purchaseOrderModel({
    productName: productName,
     Quantity: Quantity,
     Pricing: Pricing,
     MRP: MRP,
     customerId:userid
    })
    console.log(userid);
    const filter = { _id: userid };
    const options = { upsert: true };
    const updateDoc = {
      $push: {
        purchaseOrder: [
          {
            "productName": productName,
     "Quantity": Quantity,
     "Pricing": Pricing,
     "MRP": MRP,
          }
        ]
      },
    };
    // User.updateOne(filter,updateDoc,options).then((po)=>{
    //   res.send(po)
    // }).catch((err)=>{
    //   res.status(400).send(err);
    // })

   newPurchaseOrder.save().then((purchaseOrder) => {
     res.send(purchaseOrder)
    }).catch((err) => {
     console.log(err)
     res.status(400).send(err);
    })
    }
    else{
      res.status(400).json({"status":"400","Message":"Pricing Can't be greater than MRP"});
    }
   
}

const user_addShippingDetails =  (req, res) => {
    const {address, pincode, customerId, city, purchaseId} = req.body;
    var userid = ObjectID(`${customerId}`);
    var purchaseObjId = ObjectID(`${purchaseId}`);

    console.log(address);
   let newShippingAddress = new shippingAddress({
    address: address,
     pincode: pincode,
     customerId: userid,
     city: city,
     purchaseId:purchaseObjId
    })
   newShippingAddress.save().then((address) => {
     res.send(address)
    }).catch((err) => {
     console.log(err)
     res.status(400).send(err);
    })
}

module.exports={
    user_addDetail,
    user_purchaseOrder,
    user_addShippingDetails
}