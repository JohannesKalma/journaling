var createError = require('http-errors');

var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');

router.use(function(req,res,next){
    if ( req.cookies.ACCESS_TOKEN ){
      let data = jwt.verify(req.cookies.ACCESS_TOKEN,process.env.ACCESS_TOKEN_KEY);
      res.access_granted=data.access_granted;
    }
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.body);
    next();
});

/* POST listing. */
router.post('/', function(req, res, next) {
    console.log(req.body);
    next();
});

router.all('*',function(req,res,next){
    res.render('realtime',{access_granted:res.access_granted});
});

module.exports = router;