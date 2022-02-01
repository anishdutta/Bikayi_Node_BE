const express = require('express')
const mongoose = require('mongoose')
//Initialize express app
const router = express.Router();
const getDetailController = require('../controllers/getDetailController');


router.get('/getCustomersByCity/:city', getDetailController.customer_byCity)
router.get('/getCustomersWithPO', getDetailController.customer_withPO)
router.get('/getCustomersWithPOAndSD', getDetailController.customer_withPOAndSD)


module.exports = router;
