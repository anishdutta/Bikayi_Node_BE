const express = require('express')
const mongoose = require('mongoose')
//Initialize express app
var ObjectID = require("mongodb").ObjectID;

const router = express.Router();

const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json());

const User = require('../model/model')
const shippingAddress = require('../model/ShippingDetailModel')
const purchaseOrder = require('../model/purchaseOrderModel')
const purchaseOrderModel = mongoose.model('purchaseOrder', purchaseOrder)

const addDetailController = require('../controllers/addDetailController')

router.post('/addDetails', addDetailController.user_addDetail);
router.post('/purchaseOrder', addDetailController.user_purchaseOrder);
router.post('/addShippingDetails',addDetailController.user_addShippingDetails);


module.exports = router;
