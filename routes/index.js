//var express = require('express');
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});

//module.exports = router;

let createError = require('http-errors');
let express = require('express');
let router = express.Router();
let fs = require('fs');
let md = require('markdown-it')(
  {html: true,
   linkify: true,
   typographer: true
  });
  
let matter = require('gray-matter');
let jwt = require('jsonwebtoken');

let docPath=__dirname + '/../docs';

function verifyAccessToken(req,res,next){
  if ( req.cookies.ACCESS_TOKEN ){
    let data = jwt.verify(req.cookies.ACCESS_TOKEN,process.env.ACCESS_TOKEN_KEY);
    req.access_granted=data.access_granted;
  }
  next();
}

/* GET - home page, show list of recipees */
router.get('/',verifyAccessToken, function(req, res, next) {
  console.log(req.access_granted);
  let files = fs.readdirSync(docPath);
  files.reverse;
  let recipeArr = [];
  
  files.forEach(file => {
    if (file.match('^[0-9]{8}-[0-9]{5}')){
      let dat=fs.readFileSync(docPath+'/'+file,'utf8');
      dat=matter(dat);

      let recipeLine = {};
      recipeLine.file=file;
      recipeLine.title=dat.data.title;
      recipeLine.type=dat.data.type;
      recipeArr.push(recipeLine);
    } 
  });

  res.render('index',{content:recipeArr,access_granted:req.access_granted});
});

/* GET - single recipe. */
router.get('/:i',verifyAccessToken, function(req, res, next) {
  if ( req.params.i.match('^[0-9]{8}-[0-9]{5}') ){
    try {
      let dat=fs.readFileSync(docPath+'/'+req.params.i,'utf8');
      dat=matter(dat);
      console.log(dat.data);
      res.render('single',{file: req.params.i,recipe: dat.data,content: md.render(dat.content),access_granted:req.access_granted});
    }
    catch (err){
      next(createError(404));    
    }
  } else {
    next(createError(404));
  }  
})

module.exports = router;