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
    var thisSong = new song(req.body);
    thisSong.save(function (err, newSong) {
        if (err) throw err;
        else {
            console.log(newSong);
            res.json(newSong);
        }
    });
});

router.post('/addAlbum', function(req,res){
    var thisAlbum = new album(req.body);
    thisAlbum.save(function (err, newAlbum) {
        if (err) throw err;
        else {
            console.log(newAlbum);
            res.json(newAlbum);
        }
    });
});

router.post('/addArtist', function(req,res){
    var thisArtist = new artist(req.body);
    thisArtist.save(function (err, newArtist) {
        if (err) throw err;
        else {
            console.log(newArtist);
            res.json(newArtist);
        }
    });
});

//===========================================================

router.get('/search', function(req, res){
    var domain = req.query.domain;
    var query = req.query.query;
    if (domain.toLowerCase().indexOf('song') != -1) {
        console.log("Searching for Songs | " + query);
        song.find({'title': {'$regex': query , '$options': 'i'}}, function(err, matchedSongs){
            if (err) throw err;
            else {
                if (matchedSongs){
                    console.log("Found " + matchedSongs.length + " Songs");
                    res.json(matchedSongs);
                } else {
                    console.log("No Match Found!");
                    res.json(null);
                }
            }
        }).limit(5);
    } else if (domain.toLowerCase().indexOf('album') != -1) {
        console.log("Searching for Albums | " + query);
        album.find({
                    '$or': [{
                              'title': {'$regex': query , '$options': 'i'}
                          }, {
                              'description': {'$regex': query, '$options': 'i'}
                          }]
                   }, {
                       title: 1,
                       songs: 1,
                       albumImage: 1
                   }, function(err, matchedAlbums) {
                       if (err) throw err;
                       else {
                           if (matchedAlbums){
                               console.log("Found " + matchedAlbums.length + " Albums");
                               res.json(matchedAlbums);
                           } else {
                               console.log("No Match Found!");
                               res.json(null);
                           }
                       }
        }).limit(5);
    } else if (domain.toLowerCase().indexOf('artist') != -1) {
        console.log("Searching for Artists | " + query);
        artist.find({
                    '$or': [{
                              'name': {'$regex': query , '$options': 'i'}
                          }, {
                              'stageName': {'$regex': query, '$options': 'i'}
                          }]
                   }, function(err, matchedArtists){
            if (err) throw err;
            else {
                if (matchedArtists){
                    console.log("Found " + matchedArtists.length + " Artists");
                    res.json(matchedArtists);
                } else {
                    console.log("No Match Found!");
                    res.json(null);
                }
            }
        }).limit(5);
    } else {
        console.log("Invalid Domain/Query");
        res.json(null);
    }
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
