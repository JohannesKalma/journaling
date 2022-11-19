var express = require('express');
var router = express.Router();

/*
routers:
get /    = zonder id = nieuw document
get /:id = edit bestaand document

post /   = save new document
post(put) /   = update bestaand document
*/

/* New document */
router.get('/', function(req, res, next) {
  let templatePath=__dirname + '/../docs/template_base.md';
  var recipeTemplate = fs.readFileSync(templatePath,'utf-8');
  res.render('editor',{content:recipeTemplate,method:"POST"});
});

/* Edit bestaand document */
router.get('/:i', function(req, res, next) {
  let docPath=__dirname + '/../docs';
  let dat=fs.readFileSync(docPath+'/'+req.params.i,'utf8');
  res.render('editor',{content:dat,method:"PUT",file:req.params.i});
});


/* post /   = save new document
   post(put) /   = update bestaand document
*/
router.post('/', function(req, res, next) {
  let file;

  if ( req.body._method == 'PUT'){
      file=req.body._file;
  } else if ( req.body._method == 'POST') {
      let date = require('date-and-time');
      let now = new Date();
      file = date.format(now,'YYYYMMDD-HHmmss')+'.md';
  }

  fs.writeFileSync(docPath+'/'+file,req.body._document);
  let dat=matter(req.body._document);
  // hard coded access granted value
  res.render('single',{file: file,recipe: dat.data,content: md.render(dat.content),message: 'saved', access_granted: true});
});

module.exports = router;

