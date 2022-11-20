var express = require('express');
var router = express.Router();
let fs = require('fs');

let jwt = require('jsonwebtoken');

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
  //editor new
  res.documentPath=__dirname + '/../templates/default.md';
  res._method='POST';
  next();
});

router.get('/:id',function(req,res,next){
  //edit document
  res.documentPath=__dirname + '/../documents/'+req.params.id;
  res._method='PUT';
  next();
});

router.get('*',function(req,res,next){
  let document = fs.readFileSync(res.documentPath,'utf-8');
  res.render('editor',{dat:document,_method:res._method});
});

router.post('/',function(req,res,next){
  //save new file
  let date = require('date-and-time');
  let now = new Date();
  res.documentId = date.format(now,'YYYYMMDD-HHmmss')+'.md';
  next();
})

router.post('/:id',function(req,res,next){
  //update file
  res.documentId=req.params.id;
  next();
})

router.post('*',function(req,res,next){
  res.documentPath=__dirname + '/../documents/'+res.documentId;
  fs.writeFileSync(res.documentPath,req.body.dat);
  res.redirect(process.env.BASE_URL+'/editor/'+res.documentId);
})

module.exports = router;