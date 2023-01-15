const createError = require('http-errors');

const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const realtimeJournaling = require("../models/realtime") // new

async function connectMongo() {
    await mongoose.set("strictQuery", false);
    await mongoose.connect('mongodb://127.0.0.1:27017/rtj');
    const db = await mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

connectMongo();

router.use(function(req,res,next){
    if ( req.cookies.ACCESS_TOKEN ){
      let data = jwt.verify(req.cookies.ACCESS_TOKEN,process.env.ACCESS_TOKEN_KEY);
      res.access_granted=data.access_granted;
    }
    next();
});

/* GET users listing. */
router.get('/', async function(req, res, next) {
    next();
});

/* POST listing. */
router.post('/', async function(req, res, next) {
    console.log(req.body);
    const rtj = new realtimeJournaling({
        content: "ccccc"
    });
    await rtj.save();

    next();
});

router.all('*',function(req,res,next){
    realtimeJournaling.find({}).sort({createdAt:-1,_id:-1}).exec (function(err,dat){ 
       res.render('realtime',{access_granted:res.access_granted,data:dat});
    })
});

module.exports = router;