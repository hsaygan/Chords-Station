var express = require('express');
var mongodb = require('mongodb');
var Promise = require('bluebird');
var request = require('request');
var moment = require("moment");
var app = express();
var router = express.Router();

// Models
var chords = require('../../models/chords');
var song = require('../../models/song');
var album = require('../../models/album');
var artist = require('../../models/artist');

//================================================= Routers

router.post('/addChords', function(req, res){
    var thisChords = new chords(req.body);
    thisChords.save(function (err, newChords) {
        if (err) throw err;
        else {
            console.log(newChords);
            res.json(newChords);
        }
    });
});

router.post('/addSong', function(req,res){
    var thisSong = new song(req.body.thisSong);
    thisSong.save(function (err, newSong) {
        if (err) throw err;
        else {
            console.log(newSong);
            res.json(newSong);
        }
    });
});

router.post('/addAlbum', function(req,res){
    var thisAlbum = new album(req.body.thisAlbum);
    thisAlbum.save(function (err, newAlbum) {
        if (err) throw err;
        else {
            console.log(newAlbum);
            res.json(newAlbum);
        }
    });
});

router.post('/addArtist', function(req,res){
    console.log(req.body);
    var thisArtist = new artist(req.body);
    thisArtist.save(function (err, newArtist) {
        if (err) throw err;
        else {
            console.log(newArtist);
            res.json(newArtist);
        }
    });
});

// router.post('/addNewChords', function(req, res) {
//     rssarticles.find({}, {title:1, link:1}, function(err, allArticles) {
//         if (err) throw err;
//         else {
//             console.log(allArticles);
//             res.json(allArticles);
//         }
//     }).limit(10);
// });

module.exports = router;
