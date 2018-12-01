var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var statusRouter = require('./routes/status');
var albumRouter = require('./routes/album');
var imagesRouter = require('./routes/images');

var photos = require('./photos');

var app = express();
var uAlbums = [];
var images = [];


var mysql = require("mysql");
//Database connection
app.use(function(req, res, next){
	res.locals.connection = mysql.createConnection({
		host     : '127.0.0.1',
		user     : 'root',
		password : 'manageME',
		database : 'mydb'
	});
	res.locals.connection.connect();
	next();
});

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
function compare(a,b) {
  if (a.title < b.title)
    return -1;
  if (a.title > b.title)
    return 1;
  return 0;
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
    app.set('mediaDB', db.getCollection("media"));
    var entryCount = db.getCollection("media").count();
    var albums = [];
    for (var j = 1; j < entryCount ; j++) {
        var item = media.get(j);
        albums.push({"title":item.raw.TALB,"pic":item.raw.APIC});
        images.push(item.raw.APIC);
        //console.log(result[j].raw.TIT2);
    }
    Array.prototype.unique = function() {
        return this.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        });
    }
    
   

    var flags = [], uAlbums = [], l = albums.length, i;
    for( i=0; i<l; i++) {
        if( flags[albums[i].title]) continue;
        flags[albums[i].title] = true;
        uAlbums.push(albums[i]);
    }
   
    //console.log("distinct albums " + uAlbums);
    uAlbums.sort(compare);
    app.set('uAlbums', uAlbums);
    app.set('images', images);

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

//photos.dbInit();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/album', albumRouter);
app.use('/api/v1/status', statusRouter);
app.use('/api/v1/images', imagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
