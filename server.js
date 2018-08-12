var url = require('url');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var mongodb = require('mongodb');
var morgan  = require('morgan');
var mongoose = require('mongoose');
var Promise = require("bluebird");
var request = require('request');
var Fuse = require('fuse-js-latest');
var moment = require('moment', moment);
var fs = require('fs');
var sys = require('sys');
var http = require('http');
var port = 8000 || 9000;
var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/views'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

//===================================================================== Mongoose Actual Database Connection

var url = 'mongodb://localhost:27017/chords_station';
mongoose.connect(url, function (err, database) {
    if (err) {
        console.log('\nUnable to connect to the mongoDB server. Error:', err);
    }
    else {
        console.log('\nConnection established to: ', url);
    }
});
var db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//====================================================================== Routes

var chords = require('./app/routes/api/chords.js', chords);          //Schools Route File
app.use('/api/chords',chords);

var server = app.listen(port);
