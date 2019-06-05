var http = require("http");
var express = require('express');
var mydb = require("./db");
var bodyParser = require('body-parser');

//use urlencoded method to parse post requests

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); //if you are going to pass json requests


app.get('/allCategories', function(req,res) {
    mydb.findAll(req,res);n
});
app.get('/getCategory', function(req,res) {
    mydb.findOne(req,res);
});
//Please use a POST for this in your assignment
//app.get('/addCountry', function(req,res) {
//    mydb.addCountry(req,res);
//});

app.post('/addCategory', function(req,res) {
    mydb.addCategory(req,res);
});


//An example of post request. Here name:country is part of a post request
app.post('/findCategory', function(req,res) {
    mydb.findCategory(req,res);
});

//Another way to process get request. If you hit /find/India, this will match the url
//and pass India as the key country in req.params.country
//These types of url are better looking than the query-params we have seen so far.
app.get('/find/:category',function(req,res){
    mydb.findACategory(req,res);
});


app.use(express.static(__dirname + '/site'));

var server = app.listen(process.env.PORT, function () {
    console.log("Server listening at"+ process.env.PORT);
})