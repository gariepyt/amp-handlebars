/* Main Requirements */
var express = require("express");
var handlebars = require("express-handlebars");

/* Additional Features */
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var pageInfo = [];

var options = {
	host: 'localhost',
	port: '3000',
	path: '/get-pages'
};

app.engine('handlebars', handlebars({
	defaultLayout: 'main',
	partialsDir: [
		'views/partials'
	]
}));

/* Set Express */
app.set('view engine', 'handlebars' );
app.set('port', 3000);

/* Get page info */
function getData(){
	http.get("http://localhost:3000/get-pages", function(res) {
		var body = '';

		res.on('data', function(chunk){
			body += chunk;
		});

		res.on('end', function() {
			pageInfo = JSON.parse(body);
		});
	});
}
function buildData(num) {
	getData();
	var data = Object.assign({}, pageInfo[num]);
	data.menuList = [];
	for (var x = 0; x < pageInfo.length; x++) {
		if (pageInfo[x].viewable) {
			var menuItem = {url: null, name: null};
			menuItem.url = pageInfo[x].pageURL;
			menuItem.name = pageInfo[x].pageName;

			data.menuList.push(menuItem);
		}
	}

	return data;
}

/* For all static content */
app.use('/public', express.static(__dirname + '/public'));


/* API */
app.get('/get-pages', function(req, res){
	var pageData = JSON.parse(fs.readFileSync(__dirname + "/private/pages.json", 'utf8'));
	res.send(JSON.stringify(pageData));
});


/* To be run before routing */
app.use(function(req, res, next) {
	var data = buildData(0);

	console.log("This function was run");
	
	next();
});


/* Routing */
app.get('', function(req, res){
	var data = buildData(0);

	res.render(data.fileName, data);
});

app.get('/', function(req, res){
	var data = buildData(0);

	res.render(data.fileName, data);
});

app.post('/submit-form', function(req, res){
	var data = [];

	console.log(req.body);

	console.log("This function was run");

	http.get("http://localhost:3000/verify-form?name=" + req.body.name, function(resp) {
		var body = '';

		resp.on('data', function(chunk){
			body += chunk;
		});

		resp.on('end', function() {
			data = JSON.parse(body);

			console.log(data);
		
			if (data.response == "success") {
				console.log("Yes");
				res.redirect('/success');
			}
			else {
				console.log("No");
				res.redirect('/failure');
			}
		});
	});
});

app.get('/verify-form', function(req, res){
	var data = {response: null};

	console.log("/verify got: " + req.query.name);

	if (req.query.name == "error") {
		data.response = "failure";
		res.send(JSON.stringify(data));
	}
	else {
		data.response = "success";
		res.send(JSON.stringify(data));
	}
});

app.get('/:pageName', function(req, res){
	var index = -1;

	for (var x = 0; x < pageInfo.length; x++) {	
		if ('/' + req.params.pageName == pageInfo[x].pageURL) {
			index = x;
			break;
		}
	}
	
	if (index != -1) {
		var data = buildData(index);

		res.render(data.fileName, data);
	}
	else {
		res.redirect('/404');
	}
});

app.get('/404', function(req, res){
	index = pageInfo.length - 1;
	var data = buildData(index);

	res.render(data.fileName, data);
});

app.use(function(req,res,next){
	res.redirect('/404');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});