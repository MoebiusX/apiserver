const NodeID3 = require('node-id3')
const loki = require("lokijs");
var glob = require( 'glob' );
var tags = '';
var loadDB = false;

var db = new loki('sabiorg.db', {
    autoload: true,
    autoloadCallback : databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});
var media = db.getCollection("media");
// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
    if (media === null) {
        media = db.addCollection("media");
    }

    // kick off any program logic or start listening to external events
    runProgramLogic();
}

// example method with any bootstrap logic to run after database initialized
function runProgramLogic() {

	if (loadDB) {
        glob('/Users/carlosmontero/Music/**/*.mp3', function (err, files) {
            var arrayLength = files.length;
            for (var i = 0; i < arrayLength; i++) {
                console.log(i + ' ' + files[i]);
                try {
                    tags = NodeID3.read(files[i]);
                    media.insert(tags);
                }
                catch (err) {
                    console.log(err);
                }
            }
        });
    }
    var entryCount = db.getCollection("media").count();
    console.log("number of entries in database : " + entryCount);
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
    var uAlbums = albums.unique();
    console.log("distinct albums " + uAlbums.length);
    uAlbums.sort();
    for (var k=0; k<uAlbums.length; k++) {
    	console.log(uAlbums[k]);
	}

    //var result = media.find({ 'raw.COMM.language' : 'ita'  });
   /* var result = media.find({ 'raw.TALB' : 'The best of 50-60-70-80-90'  });
    console.log("Total numbrer of songs matching " + result.length);
    for (var j = 0; j < result.length; j++) {
        console.log(j);
    	console.log(result[j].raw.TIT2);
    }*/
    //console.log(media.get(1));
    process.exit(0);
}

