const mongoose = require('mongoose');

// Schema for AddressBook
const purchaseOrderModel = mongoose.Schema({
    productName: {
     type: String,
     required: true
    },
    Quantity: {
     type: Number,
     required: true
    },
    Pricing: {
     type: Number,
     required: true
    },
    MRP: {
     type: Number,
     required: true
    },
    customerId: {
     type: mongoose.Schema.ObjectId,
     required: true
    },
    purchaseId:{
        type: mongoose.Schema.ObjectId,
        auto:true
    }
   })
   //Creating the collection Address
//    const purchaseOrder = mongoose.model('purchaseOrder', purchaseOrderModel)

   module.exports = purchaseOrderModel;

   