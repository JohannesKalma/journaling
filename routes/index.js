var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let createError = require('http-errors');

const mongoose = require("mongoose");

let md = require('markdown-it')(
  {html: true,
   linkify: true,
   typographer: true,
   breaks:true
  });

const model = require("../models/documents") // new

async function connectMongo() {
    await mongoose.set("strictQuery", false);
    await mongoose.connect('mongodb://127.0.0.1:27017/documents');
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

/* GET - home page, show list of recipees */
router.get('/', async function(req, res, next) {
  let documentHeaders = [];
  
  /* mongo getter*/  
  var mongodocs = await model.find();
  for (doc of mongodocs){
    let documentHeader = {};
    let data = {};
    documentHeader.id=doc._id;
    data.Title=doc.title;
    data.Description = doc.description;
    data.Author = doc.author;
    data.Date = doc.createdAt;
    documentHeader.data=data;
    documentHeaders.push(documentHeader);
  }
  res.render('index',{documentHeaders:documentHeaders,access_granted:res.access_granted,title:'Journal Johannes'});
});

router.get('/:i',async function(req, res, next) {
      var d = await model.findById(req.params.i);
      res.render('single',{data:d, renderedContent: md.render(d.content), access_granted:res.access_granted,title:d.title});
})

module.exports = router;
