var express = require('express');
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var router = express.Router();
const mongoose = require("mongoose");

let jwt = require('jsonwebtoken');

const Model = require("../models/documents") // new

async function connectMongo() {
  await mongoose.set("strictQuery", false);
  await mongoose.connect('mongodb://127.0.0.1:27017/documents');
  const db = await mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
}

connectMongo();

/*
routers:
--new document
get /    = zonder id = nieuw document

--edit document
get /:id = edit bestaand document

--save new document
post /   = save new document

--update existing document
post(put) /:id   = update bestaand document
*/

// when not logged in route to login screen.
router.use(function(req,res,next){
  if ( req.cookies.ACCESS_TOKEN ){
    let data = jwt.verify(req.cookies.ACCESS_TOKEN,process.env.ACCESS_TOKEN_KEY);
    req.access_granted=data.access_granted;
    next();
    return;
  }
  res.locals.message='login to edit documents';
  res.render('login',{return_page:'editor'});
});

router.get('/',function(req,res,next){ 
  res._method='POST';
  let data = {
  };
  res.render('editor',{data,_method:'POST'});
});

router.get('/:id',async function(req,res,next){
  var data = await Model.findOne({_id:req.params.id});
  res.render('editor',{data,_method:'PUT'});
});

router.use(methodOverride('_method'));

router.post('/',async function(req,res,next){
  var model = new Model({
    title:req.body.title,
    description:req.body.description,
    content:req.body.content
  });
  let result = await model.save();
  res.redirect(process.env.BASE_URL+'/'+result._id.valueOf());
})

router.put('/:id', async function(req,res,next){
  await Model.findByIdAndUpdate(req.params.id,{
    title:req.body.title,
    description:req.body.description,
    content:req.body.content
  });
  res.redirect(process.env.BASE_URL+'/'+req.params.id);
});

module.exports = router;