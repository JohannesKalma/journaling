var createError = require('http-errors');

var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');

/* GET users listing. */
router.use('*', function(req, res, next) {
  res.clearCookie('ACCESS_TOKEN');
  res.render('restricted',{});
});

module.exports = router;
