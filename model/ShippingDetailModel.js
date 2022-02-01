const mongoose = require('mongoose');

// Schema for AddressBook
const shippingDetailSchema = mongoose.Schema({
    address: {
     type: String,
     required: true
    },
    pincode: {
     type: String,
     required: true
    },
    customerId: {
     type: mongoose.Schema.ObjectId,
     required: true
    },
    city: {
     type: String,
     required: true
    },
    purchaseId:{
        type: mongoose.Schema.ObjectId,
        required: true
    }
   })
   //Creating the collection Address
   const shippingDetail = mongoose.model('shippingDetail', shippingDetailSchema)

   module.exports = shippingDetail;

   