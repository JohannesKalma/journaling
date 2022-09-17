const { locale } = require('date-and-time');
let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');

router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function(req, res, next) {
    res.clearCookie('ACCESS_TOKEN');
    if (req.body._key === process.env.USER_KEY){
        let tokenExpires = 1000*60*60*24;
        let access_token = jwt.sign({access_granted: true},process.env.ACCESS_TOKEN_KEY,{expiresIn: tokenExpires});
        res.cookie('ACCESS_TOKEN',access_token,{maxAge: 1000*60*60*12 });
        res.redirect(process.env.BASE_URL+'/');
    } else {
        res.send('incorrect password');
    }    
});

module.exports = router;