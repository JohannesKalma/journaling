var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Editor' });
});

module.exports = router;

/*
get /    = zonder id = nieuw document
get /:id = edit bestaand document

post /   = save new document
post(put) /   = update bestaand document
*/