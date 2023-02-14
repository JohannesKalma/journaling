var express = require('express');
var router = express.Router();
let createError = require('http-errors');

const mongoose = require("mongoose");
const model = require("../models/documents");

async function connectMongo() {
    await mongoose.set("strictQuery", false);
    await mongoose.connect('mongodb://127.0.0.1:27017/documents');
    const db = await mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

connectMongo();

/* GET - home page, show list of recipees */
router.get('/', async function(req, res, next) {

    var journaltypes = await model.distinct('journalType');
    console.log(journaltypes); 
    var journals=await model.find({journalType:{$exists:false}});
    console.log(journals);
})

module.exports = router;
