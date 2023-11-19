const express = require('express')
const methodOverride = require('method-override')
const router = express.Router()
const jwt = require('jsonwebtoken')

const Model = require("../models/documents") // new
const mongoDB = require("../lib/mongoDb") 
mongoDB.connect()

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

// when not logged in redirct to base url
router.use(function(req,res,next){
  if ( req.cookies.ACCESS_TOKEN ){
    let data = jwt.verify(req.cookies.ACCESS_TOKEN,process.env.ACCESS_TOKEN_KEY);
    req.access_granted=data.access_granted;
    res.access_granted=data.access_granted;
    next();
    return;
  }
  res.redirect(process.env.BASE_URL);
});

const getSelectList = async () => {
  let list = await Model.find().distinct("journalType");
  return list;
}

router.get('/',async function(req,res,next){ 
  let data = {};
  getSelectList();
  res.render('editor',{data, _method:'POST', selectList: await getSelectList(),access_granted:res.access_granted});
});

router.get('/:id',async function(req,res,next){
  var data = await Model.findOne({_id:req.params.id});
  getSelectList();
  res.render('editor',{data, _method:'PUT', selectList:await getSelectList(),access_granted:res.access_granted});
});

router.use(methodOverride('_method')); //make put method available to router

const reqBodyToModel = (req)=>{
  return {
    title:req.body.title,
    description:req.body.description,
    content:req.body.content,
    journalType:req.body.journalType,
    public:req.body.public
  }
}

router.post('/',async function(req,res,next){
  console.log(req.body);
  var model = new Model(reqBodyToModel(req));
  let result = await model.save();
  res.redirect(process.env.BASE_URL+'/'+result._id.valueOf());
})

router.put('/:id', async function(req,res,next){
  console.log(req.body);
  let result = await Model.findByIdAndUpdate(req.params.id,reqBodyToModel(req));
  res.redirect(process.env.BASE_URL+'/'+req.params.id);
});

module.exports = router;
