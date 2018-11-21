const NodeID3 = require('node-id3')
 
/* Variables found in the following usage examples */
 
//  file can be a buffer or string with the path to a file
let file = '/Users/carlosmontero/Music//iTunes/iTunes Media/Music/Bob Dylan/The best of 50-60-70-80-90/Hurricane.mp3' || new Buffer("Some Buffer of a (mp3) file")
let tags = NodeID3.read(file)
console.log(tags)
