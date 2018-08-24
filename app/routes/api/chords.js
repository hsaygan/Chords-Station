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

//===========================================================

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
            album.update({_id: newSong.album}, {'$push': {songs: newSong._id}})
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
        console.log("\nSearching for Songs | " + query);
        song.find({
                    'title': {'$regex': query , '$options': 'i'}
                },{
                    title: 1,
                    songImage: 1,
                }, function(err, matchedSongs){
            if (err) throw err;
            else {
                if (matchedSongs){
                    console.log("Found " + matchedSongs.length + " Songs");
                    var finalMatchedSongs = [];
                    matchedSongs.forEach(function(thisSong){
                        var newSong = {
                            _id: thisSong._id,
                            title: thisSong.title,
                            songImage: thisSong.songImage,
                            type: "Song",
                        }
                        finalMatchedSongs.push(newSong);
                    });
                    console.log("Final Matched Songs: ", finalMatchedSongs);
                    res.json(finalMatchedSongs);
                } else {
                    console.log("No Match Found!");
                    res.json(null);
                }
            }
        }).limit(5);
    } else if (domain.toLowerCase().indexOf('album') != -1) {
        console.log("\nSearching for Albums | " + query);
        album.find({
                    '$or': [{
                              'title': {'$regex': query , '$options': 'i'}
                          }, {
                              'description': {'$regex': query, '$options': 'i'}
                          }]
                   }, {
                       title: 1,
                       albumImage: 1,
                   }, function(err, matchedAlbums) {
                       if (err) throw err;
                       else {
                           if (matchedAlbums){
                               console.log("Found " + matchedAlbums.length + " Albums");
                               var finalMatchedAlbums = [];
                               matchedAlbums.forEach(function(thisAlbum){
                                   var newAlbum = {
                                       _id: thisAlbum._id,
                                       title: thisAlbum.title,
                                       albumImage: thisAlbum.albumImage,
                                       type: "Album",
                                   }
                                   finalMatchedAlbums.push(newAlbum);
                               });
                               console.log("Final Matched Albums: ", finalMatchedAlbums);
                               res.json(finalMatchedAlbums);
                           } else {
                               console.log("No Match Found!");
                               res.json(null);
                           }
                       }
        }).limit(5);
    } else if (domain.toLowerCase().indexOf('artist') != -1) {
        console.log("\nSearching for Artists | " + query);
        artist.find({
                    '$or': [{
                              'name': {'$regex': query , '$options': 'i'}
                          }, {
                              'stageName': {'$regex': query, '$options': 'i'}
                          }]
                   }, {
                       stageName: 1,
                       displayImage: 1,
                   }, function(err, matchedArtists){
            if (err) throw err;
            else {
                if (matchedArtists){
                    console.log("Found " + matchedArtists.length + " Artists");
                    var finalMatchedArtists = [];
                    matchedArtists.forEach(function(thisArtist, i){
                        var newArtist = {
                            _id: thisArtist._id,
                            stageName: thisArtist.stageName,
                            displayImage: thisArtist.displayImage,
                            type: "Artist",
                        }
                        finalMatchedArtists.push(newArtist);
                    });
                    console.log("Final Matched Artists: ", finalMatchedArtists);
                    res.json(finalMatchedArtists);
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

function getSongDetails(songId, callback){
    song.findOne({_id: songId}, {}, function(err, thisSong){
        if (err) {
            console.log("Error Finding Song entry of the selected song: " + thisSong.title, err);
            callback(null);
        } else {
            album.findOne({_id: thisSong.album}, {title: 1, releaseDate: 1}, function(err, thisAlbum){
                if (err){
                    console.log("Error Finding Album of the selected song: " + thisSong.title, err);
                    callback(null);
                } else {
                    artist.findOne({_id: thisAlbum.artist}, {stageName: 1}, function(err, thisArtist){
                        if (err){
                            console.log("Error Finding Artist of the selected song: " + thisSong.title, err);
                            callback(null);
                        } else {
                            thisSong.album = thisAlbum.title;
                            thisSong.releaseDate = thisAlbum.releaseDate;
                            thisSong.artist = thisArtist.stageName;
                            callback(thisSong);
                        }
                    });
                }
            });
        }
    });
}

router.get('/getSongDetails', function(req, res){
    var songId = req.query.id;
    getSongDetails(songId, function(thisSong){
        if (thisSong){
            res.json(thisSong);
        } else {
            console.log("Invalid Song: ", thisSong);
            res.json(null);
        }
    });
});

router.get('/getSongsByArtist', function(req, res){
    var artistId = req.query.id;
    var allSongs = [];
    // Find albums by that artist, add those album's songs to allSongs
    album.find({artist: artistId}, {songs: 1}, function(err,allAlbumsOfArtist){
        if (err){
            console.log("Error fetching all albums of the selected Artist: " + artistId);
            res.json(null);
        } else {
            if (allAlbumsOfArtist && allAlbumsOfArtist.length > 0){
                allAlbumsOfArtist.forEach(function(thisAlbum){
                    allSongs = allSongs.concat(thisAlbum.songs);
                });
            }
        }
        console.log("Done finding albums", allAlbumsOfArtist);
        // Find songs the artist was featured in, add those songs to allSongs
        song.find({featuredArtists: artistId}, {_id: 1}, function(err, featuredSongs){
            if (err){
                console.log("Error fetching featured songs of selected Artist: " + artistId);
            } else {
                if (featuredSongs && featuredSongs.length > 0){
                    featuredSongs.forEach(function(thisSong){
                        allSongs = allSongs.push(thisSong._id)
                    });
                }
            }
            console.log("Done finding featured songs", featuredSongs);
            // Return allSongs
            if (allSongs && allSongs.length > 0){
                console.log("All Songs from the Artist: ", allSongs);
                res.json(allSongs);
            } else {
                res.json(null);
            }
        });
    });
});

router.get('/getSongsByAlbum', function(req, res){
    var albumId = req.query.id;
    var allSongs = [];
    album.findOne({album: albumId}, {songs: 1}, function(err, thisAlbum){
        if (err){
            console.log("Error fetching selected album: " + albumId);
            res.json(null);
        } else {
            if (thisAlbum){
                allSongs = thisAlbum.songs;
                res.json(allSongs);
            }
        }
    });
});

router.get('/checkoutChords', function(req, res){
    var songId = req.query.id;
    // Get All Songs in this Album
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
