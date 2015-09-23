var fs = require('fs');
var HashMap = require('hashmap');

var arguments = process.argv.slice(2);
var lastReadLine = new HashMap();
var readStreamObj =  new HashMap();

if(arguments.length != 1){
	process.stdout.write("usage node nodebot <dir/filename>\n");
	process.exit();
}
var path = arguments[0];
fs.watch(path, function (event, filename) {
    if (filename) {
		if(readStreamObj.get(filename)){
			console.log('file name exits in hashmap');
			console.log(readStreamObj.get(filename));
		}else{
			readStreamObj.set(filename,fs.createReadStream(path+filename,{autoClose:false}));
			readStreamObj.get(filename)
			.on('end', function() {

			})
			.on('data', function(chunk) {
				console.log(chunk.toString());
				readStreamObj.get(filename).pause();
			});
		}
    } else {
        console.log('filename not provided');
    }
});
