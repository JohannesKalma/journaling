var express = require('express');
var router = express.Router();
let fs = require('fs');
let jwt = require('jsonwebtoken');
let matter = require('gray-matter');
let createError = require('http-errors');
const documents = require('../models/documents');

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

let docPath=__dirname + '/../documents';

/* GET - home page, show list of recipees */
router.get('/', async function(req, res, next) {
  let documentHeaders = [];
  
  /* start legacy */
  let files = fs.readdirSync(docPath);
  files.reverse;
  //files.forEach(file => {
  console.log('legacy get part - can be removed when all documents have been moved to mongo')
  for await (f of files){ 
    if (f.match('^[0-9]{8}-[0-9]{5}')){
      let fileExists = await model.exists({legacy:{filename:f}});
        //console.log( f + ' - ' + fileExists );
        if (!fileExists){ 
        let fileContent=fs.readFileSync(docPath+'/'+f,'utf8');
        let document = matter(fileContent);
        let documentHeader = {};
        documentHeader.file = f;
        documentHeader.data = document.data;
        documentHeader.legacy = 'true';
        documentHeaders.push(documentHeader);
    }
    } 
  };
  /* end legacy */

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

router.get('/legacy/:i',function(req, res, next) {
  console.log ('old legacy');
  if ( req.params.i.match('^[0-9]{8}-[0-9]{5}') ){
      let fileContent=fs.readFileSync(docPath+'/'+req.params.i,'utf8');
      dat=matter(fileContent);
      //console.log(dat);
      res.render('single_legacy',{file: req.params.i, data:dat.data, content: md.render(dat.content), access_granted:res.access_granted,title:dat.data.title});
      
  }
})

router.get('/:i',async function(req, res, next) {
      var d = await model.findById(req.params.i);
      //console.log(d._id.valueOf());
      res.render('single',{data:d, renderedContent: md.render(d.content), access_granted:res.access_granted,title:d.title});
})

module.exports = router;
