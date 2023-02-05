var express = require('express');
var bodyParser = require('body-parser')
var matter = require('gray-matter');
var methodOverride = require('method-override')
var router = express.Router();
let fs = require('fs');
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
  let data = {};
  data.title='New document';
  res.render('editor',{data,_method:'POST'});
});

router.get('/:id',async function(req,res,next){
  var d = await Model.findOne({_id:req.params.id});
  //console.log(d);
  res.render('editor',{data:d,_method:'PUT'});
});

/* komt te vervallen */
router.get('/legacy/:id', async function(req,res,next){
  console.log('legacy route');
  //edit document
  var documentPath=__dirname + '/../documents/'+req.params.id;
  let document = fs.readFileSync(documentPath,'utf-8');
  doc = await matter(document);
  //console.log(doc);
  res.render('editor_legacy',{document:doc,_method:'PUT',file:req.params.id});
});

//router.use(bodyParser.urlencoded());
router.use(methodOverride('_method'));

router.post('/',async function(req,res,next){
  //save new file
  let doc={};
  doc['title']=req.body.Title;
  doc['description']=req.body.Description;
  doc['content']=req.body.content;
  var model = new Model({
    title:req.body.Title,
    description:req.body.Description,
    content:req.body.content
  });
  
  let result = await model.save();
  //console.log(result);
  res.redirect(process.env.BASE_URL+'/'+result._id.valueOf());
})

router.put('/:id', async function(req,res,next){
  console.log('johannes');
  console.log(req.params.id);
  console.log(req.body);
  await Model.findByIdAndUpdate(req.params.id,{
    title:req.body.Title,
    description:req.body.Description,
    content:req.body.content
  });
  res.redirect(process.env.BASE_URL+'/'+req.params.id);
});

/* deze router gaat ooir vervallen */
router.put('/legacy/:id',async function(req,res,next){
  console.log('legacy put method');
  let doc={};
  doc['title']=req.body.Title;
  doc['description']=req.body.Description;
  doc['content']=req.body.content;
  var model = await new Model({
    title:req.body.Title,
    description:req.body.Description,
    content:req.body.content,
    legacy: {filename:req.params.id},
  });
  // save the bear and check for errors
  var result = await model.save();

  res.redirect(process.env.BASE_URL+'/'+result._id.valueOf());
})

module.exports = router;
