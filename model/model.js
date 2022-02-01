const mongoose = require('mongoose');
const purchaseOrder = require('./purchaseOrderModel')

// Schema for AddressBook
const UserSchema = mongoose.Schema({
    customerName: {
     type: String,
     required: true
    },
    email: {
     type: String,
     required: true
    },
    mobileNumber: {
     type: Number,
     required: true
    },
    city: {
     type: String,
     required: true
    },
    customerId:{
        type: mongoose.Schema.ObjectId,
        auto:true
    }
   })
   //Creating the collection Address
   const User = mongoose.model('User', UserSchema)

   module.exports = User;

   