const express = require('express')
const mongoose = require('mongoose')
//Initialize express app
var ObjectID = require("mongodb").ObjectID;

const app = express();
//Initialize the sever
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

const User = require('./model/model')
const shippingAddress = require('./model/ShippingDetailModel')
const purchaseOrder = require('./model/purchaseOrderModel')
const purchaseOrderModel = mongoose.model('purchaseOrder', purchaseOrder)


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://anishdutta:deep2000@cluster0.vvixz.mongodb.net/Bikayi_BE?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(`${uri}`, {useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
 console.log('connected to db')
}).catch((error) => {
 console.log(error)
})
app.post('/api/customer/addDetails', (req, res) => {
    const {customerName, email, mobileNumber, city} = req.body;
    console.log(customerName);
   let newUser = new User({
    customerName: customerName,
     email: email,
     mobileNumber: mobileNumber,
     city: city
    })
   newUser.then((User) => {
     res.send(User)
    }).catch((err) => {
     console.log(err)
     res.status(400).send(err);
    })
})
app.post('/api/customer/purchaseOrder', (req, res) => {
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
   
})
app.post('/api/customer/addShippingDetails', (req, res) => {
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
})
app.get('/api/customer/getCustomersByCity/:city', (req, res) => {
    const city = req.params.city;
console.log(city);
    User.find({city:`${city}`},(err,user)=>{
      res.send(user);
    })

})
app.get('/api/customer/getCustomersWithPO', (req, res) => {
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

})
app.get('/api/customer/getCustomersWithPOAndSD', (req, res) => {

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

})

app.listen(4000, () => {
    console.log('sever listening on port:4000');
});
