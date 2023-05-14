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

  if (! res.access_granted == true ) {
    res.render('login',{return_page:'editor'});
    return
  } 


  let documentHeaders = [];
  /* mongo getter*/  
  var mongodocs = await model.find();
  for (doc of mongodocs){
    //if (doc.public == true || ( res.access_granted == true && doc.public == false ) ) {
      let documentHeader = {
        id : doc._id,
        data : {
          Title : doc.title,
          Description : doc.description,
          Author : doc.author,
          Date : doc.createdAt,
          Public : doc.public,
        },
      };
      documentHeaders.push(documentHeader);
    }
  //}
  res.render('index',{documentHeaders,access_granted:res.access_granted,title:'Journal Johannes'});
});

router.get('/:i',async function(req, res, next) {
      try {
        let data = await model.findById(req.params.i);
        res.render('single',{data, renderedContent: md.render(data.content), access_granted:res.access_granted,title:data.title});
      } catch(err) {   
        next(err);
      }
      }); 

// catch 404 and forward to error handler
router.use(function(req, res, next) {
  next(createError(404));
});

// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = router;
