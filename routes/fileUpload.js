const express = require('express');
const router = express.Router();

var multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ storage: storage });


router.get('/', async function(req, res, next) {
  res.send("hoidiepoi");
});

router.post('/', upload.single('file') ,async function(req, res, next) {
  console.log(req);
  res.send("gezonden");	
});

module.exports = router;
