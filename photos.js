module.exports = {
    dbInit: function() {
        databaseInitialize();
    },
    multiply: function(a,b) {
        return a*b
    }

};

const loki = require("lokijs");
var glob = require( 'glob' );
var tags = '';
var loadDB = true;
var ExifImage = require('exif').ExifImage;

var db = new loki('sabiorg.db', {
    autoload: true,
    autoloadCallback : databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});
var photos = db.getCollection("photos");
// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
    if (photos === null) {
        photos = db.addCollection("photos");
    }

    // kick off any program logic or start listening to external events
    runProgramLogic();
}

function runProgramLogic() {
    var pattern ='/Users/carlosmontero/Desktop/**/*.{jpg,jpeg}';
    var options = {nocase:true};
    if (loadDB) {
        glob(pattern, options,function (err, files) {
            var arrayLength = files.length;
           // for (var i = 0; i < arrayLength; i++) {
            var i =0;
            files.forEach(async function(file){

                try {
                        console.log(i + ' ' + file);
                        await new ExifImage({ image : file }, function (error, exifData) {
                            if (error){
                                console.log('ERROR ========================= '+i + ' ' + file);
                                console.log('Error: '+error.message);
                            }

                            else {
                                console.log('OK ++++++++++++++++++++++ '+i + ' ' + file);
                                console.log(exifData); // Do something with your data!
                            }

                        });

                    // tags = NodeID3.read(files[i]);
                    // media.insert(tags);
                }
                catch (err) {
                    console.log(err);
                }
                i++;
            });
        });
    }
    // app.set('photosDB', db.getCollection("photos"));
    // var entryCount = db.getCollection("photos").count();
    // var albums = [];
    // for (var j = 1; j < entryCount ; j++) {
    //     var item = media.get(j);
    //     albums.push({"title":item.raw.TALB,"pic":item.raw.APIC});
    //     images.push(item.raw.APIC);
    //     //console.log(result[j].raw.TIT2);
    // }
    // Array.prototype.unique = function() {
    //     return this.filter(function (value, index, self) {
    //         return self.indexOf(value) === index;
    //     });
    // }



    // var flags = [], uAlbums = [], l = albums.length, i;
    // for( i=0; i<l; i++) {
    //     if( flags[albums[i].title]) continue;
    //     flags[albums[i].title] = true;
    //     uAlbums.push(albums[i]);
    // }
    //
    // //console.log("distinct albums " + uAlbums);
    // uAlbums.sort(compare);
    // app.set('uAlbums', uAlbums);
    // app.set('images', images);

    // for (var k=0; k<uAlbums.length; k++) {
    //     console.log(uAlbums[k]);
    // }

    //var result = media.find({ 'raw.COMM.language' : 'ita'  });
    /* var result = media.find({ 'raw.TALB' : 'The best of 50-60-70-80-90'  });
     console.log("Total numbrer of songs matching " + result.length);
     for (var j = 0; j < result.length; j++) {
         console.log(j);
         console.log(result[j].raw.TIT2);
     }*/
    //console.log(media.get(1));
}