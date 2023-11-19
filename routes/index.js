const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const md = require('markdown-it')(
  {
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  }).use(require('markdown-it-footnote'));

const model = require("../models/documents")
const mongoDB = require("../lib/mongoDb")
mongoDB.connect()

router.use(function (req, res, next) {
  if (req.cookies.ACCESS_TOKEN) {
    let data = jwt.verify(req.cookies.ACCESS_TOKEN, process.env.ACCESS_TOKEN_KEY);
    res.access_granted = data.access_granted;
  }
  next();
});

router.get('/', async function (req, res, next) {
  // if no logintoken, then render restricted page and quit.
  if (!res.access_granted == true) {
    res.render('restricted', {});
    return
  }

  let documentHeaders = [];
  /* mongo getter*/
  var mongodocs = await model.find().sort({ 'createdAt': -1 });
  for (doc of mongodocs) {
    let documentHeader = {
      id: doc._id,
      data: {
        Title: doc.title,
        Description: doc.description,
        Author: doc.author,
        Date: doc.createdAt,
        Public: doc.public,
      },
    };
    documentHeaders.push(documentHeader);
  }
  res.render('index', { documentHeaders, access_granted: res.access_granted, title: 'Journal Johannes' });
});

router.get('/:i', async function (req, res, next) {
  try {
    let data = await model.findById(req.params.i);
    res.render('single', { data, renderedContent: md.render(data.content), access_granted: res.access_granted, title: data.title });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
