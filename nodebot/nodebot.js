var config = require('./config.json');
var fs = require('fs');
var cassandra = require('cassandra-driver');
var arguments = process.argv.slice(2);
var server_name = "server1";

if(arguments.length != 1){
	process.stdout.write("usage node nodebot <filename>\n");
	process.exit();
}
var file_path = arguments[0];


var last_read_line = 0;
var client = new cassandra.Client({contactPoints: config.contactPoints.split(" "),keyspace: config.key_space});

var query = 'INSERT INTO '+config.table_name+' (log_id,log_text) VALUES(?,?)';

fs.watchFile(file_path, function () {
	fs.createReadStream(file_path)
	.on('data', function(chunk) {
		var read_data = chunk.toString().split("\n").slice(last_read_line);
		for(d in read_data){
			var params = [new Date().toISOString(),read_data[d]];
			client.execute(query,params, function (err, result) {
				if(err)
					console.log(err);
			});
			console.log(read_data[d]);
		}
		last_read_line += read_data.length;
	});
});
