var express = require('express');
var router = express.Router();

const NodeID3 = require('node-id3')
const loki = require("lokijs");
var glob = require( 'glob' );
var tags = '';
var loadDB = false;


router.get('/', function(req, res, next) {
    var media = req.app.get('mediaDB');
    var entryCount = media.count();
    //console.log("number of entries in database : " + entryCount);
    //console.log(uAlbums);
    var albums = [];
    for (var j = 1; j < entryCount ; j++) {
        var item = media.get(j);
        albums.push(item.raw.TALB);
        //console.log(result[j].raw.TIT2);
    }
    Array.prototype.unique = function() {
        return this.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    }
    var nAlbums = albums.unique().length;
    res.send(JSON.stringify({"status": 200, "error": null, "mediaCount": entryCount, "nAlbums": nAlbums}));
});

module.exports = router;