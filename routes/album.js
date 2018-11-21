var express = require('express');
var router = express.Router();
const NodeID3 = require('node-id3')
const loki = require("lokijs");
var glob = require( 'glob' );
var tags = '';
var loadDB = false;


router.get('/', function(req, res, next) {
    var uAlbums = req.app.get('uAlbums');
    //console.log(uAlbums);
    res.send(JSON.stringify({"status": 200, "error": null, "album": uAlbums}));
});

module.exports = router;