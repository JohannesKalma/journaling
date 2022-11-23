var express = require('express');
var router = express.Router();
let fs = require('fs');
let jwt = require('jsonwebtoken');
let matter = require('gray-matter');
let createError = require('http-errors');

let md = require('markdown-it')(
  {html: true,
   linkify: true,
   typographer: true
  });

router.use(function(req,res,next){
  if ( req.cookies.ACCESS_TOKEN ){
    let data = jwt.verify(req.cookies.ACCESS_TOKEN,process.env.ACCESS_TOKEN_KEY);
    res.access_granted=data.access_granted;
  }
  next();
});

let docPath=__dirname + '/../documents';

/* GET - home page, show list of recipees */
router.get('/', function(req, res, next) {

  //console.log(req.access_granted);
  let files = fs.readdirSync(docPath);
  files.reverse;
  let documentHeaders = [];
  
  files.forEach(file => {
    if (file.match('^[0-9]{8}-[0-9]{5}')){
      let fileContent=fs.readFileSync(docPath+'/'+file,'utf8');
      let document=matter(fileContent);

      let documentHeader = {};
      documentHeader.file = file;
      documentHeader.data = document.data;
      documentHeaders.push(documentHeader);
    } 
  });
  console.log(documentHeaders);
  res.render('index',{documentHeaders:documentHeaders,access_granted:res.access_granted,title:'Journal Johannes'});
});

/* GET - single recipe. */
/**
 * https://danielmiessler.com/study/difference-between-uri-url/ 
 * read this page to get some insight in url urn uri .... 
 */
router.get('/:i',function(req, res, next) {
  if ( req.params.i.match('^[0-9]{8}-[0-9]{5}') ){
    //try {
      let fileContent=fs.readFileSync(docPath+'/'+req.params.i,'utf8');
      //console.log(fileContent);
      dat=matter(fileContent);
      //console.log(dat);
      res.render('single',{file: req.params.i,data:dat.data,content: md.render(dat.content),access_granted:res.access_granted});
    //}
    //catch (err){
    //  next(createError(404));
    //}
  } //else {
    //next(createError(404));
  //}
})

module.exports = router;
