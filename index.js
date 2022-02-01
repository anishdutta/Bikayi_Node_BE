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


const getDetails = require('./routes/getDetails');
const addDetails = require('./routes/addDetails');

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://anishdutta:deep2000@cluster0.vvixz.mongodb.net/Bikayi_BE?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(`${uri}`, {useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
 console.log('connected to db')
}).catch((error) => {
 console.log(error)
})


app.use("/api/customer",getDetails);
app.use("/api/customer",addDetails);

app.listen(4000, () => {
    console.log('sever listening on port:4000');
});
