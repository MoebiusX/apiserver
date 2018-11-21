var express = require('express');
var router = express.Router();
const NodeID3 = require('node-id3')
const loki = require("lokijs");
var glob = require( 'glob' );
var tags = '';
var loadDB = false;


router.get('/', function(req, res, next) {
    var images = req.app.get('images');
    //console.log(uAlbums);
    res.send(JSON.stringify({"status": 200, "error": null, "image": images.slice(1,2)}));
});

module.exports = router;