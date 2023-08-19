var createError = require('http-errors');

var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/***
 * loginprocess:
 * 1. username + password over https (post)
 * 2. post router:
 *    a. check if password (user_key) matches the one stored 
 *    b. if no match, then http 401 Unauthorized
 *    c. if match, then create token and add it as cookie to result method
 */

router.post('/', function(req, res, next) {
  console.log('router.post');
  res.clearCookie('ACCESS_TOKEN');
  console.log('cookie cleared');
  if (req.body._key === process.env.USER_KEY){
      console.log('key matches');	  
      let tokenExpires = 1000*60*60*24;
      let access_token = jwt.sign({user_name:req.body._name , access_granted: true},process.env.ACCESS_TOKEN_KEY,{expiresIn: tokenExpires});
      res.cookie('ACCESS_TOKEN',access_token,{maxAge: 1000*60*60*12 });
      res.redirect(process.env.BASE_URL + '/');
      return;
  }
  next(createError(401));
});


// error handler
router.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message + " - incorrect password";

  res.status(err.status || 500);
  res.render('login');
});

module.exports = router;
