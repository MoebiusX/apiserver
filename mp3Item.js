const NodeID3 = require('node-id3')
const loki = require("lokijs");
var glob = require( 'glob' );
var tags = '';
var loadDB = false;

router.get('/', function(req, res, next) {
    res.render('mp3view',  { title: 'Sabiorg', mp3Albums: uAlbums });
});

// for (var k=0; k<uAlbums.length; k++) {
//     console.log(uAlbums[k]);
// }