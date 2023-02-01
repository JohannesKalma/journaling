const createError = require('http-errors');

const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/api/day', async function(req, res, next) {
    try {
        const response = await axios.get('http://eyowv23r7po2py16.myfritz.net:10180/api/v1/powergas/day?limit=1&json=object');
        console.log(response.data[0]);
        res.json(response.data[0]);
    } catch (error) {
        console.error(error);
        res.json({message:error});
      }
});

router.get('/api/current', async function(req, res, next) {
    try {
        const response = await axios.get('http://eyowv23r7po2py16.myfritz.net:10180/api/v1/smartmeter?limit=1&json=object');
        //console.log(response.data[0]);
        res.json(response.data[0]);
    } catch (error) {
        console.error(error);
        res.json({message:error});
      }
});

/* GET users listing. */
router.get('/', async function(req, res, next) {
    res.render('p1');
});

module.exports = router;