var chordsStationApp = angular.module("chordsStationApp", ['ngRoute', 'ngMaterial', 'ngYoutubeEmbed', 'ngTable']);

chordsStationApp.config(function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark')
    .dark()
    .primaryPalette('light-blue')
    .accentPalette('blue');
});

chordsStationApp.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'html/welcome.html',
            controller  : 'mainController'
        })
        .when('/DataEntry', {
            templateUrl : 'html/dataEntry.html',
            controller  : 'dataEntryController'
        })
        .when('/Chords', {
            templateUrl : 'html/chords.html',
            controller  : 'chordsController'
        });
        // .when('/ViewChords', {
        //     templateUrl : 'html/viewChords.html',
        //     controller  : 'mainController'
        // })
});

chordsStationApp.controller('mainController', function($scope){
    $scope.message = "Hi, Welcome to this Site!";
});

chordsStationApp.service('dataEntryService', function($http){
    this.addArtist = function (obj){
        return $http.post('/api/chords/addArtist', obj);
    };

    this.addSong = function (obj){
        return $http.post('/api/chords/addSong', obj);
    };

    this.addAlbum = function (obj){
        return $http.post('/api/chords/addAlbum', obj);
    };

    this.search = function (domain, query){
        return $http.get('/api/chords/search?domain=' + domain + "&query=" + query);
    }
});

chordsStationApp.service('chordsService', function($http){
    this.search = function (domain, query){
        return $http.get('/api/chords/search?domain=' + domain + "&query=" + query);
    }
    this.getSongDetails = function(songId){
        return $http.get('/api/chords/getSongDetails?id=' + songId);
    }
    this.getSongsByArtist = function(artistId){
        return $http.get('/api/chords/getSongsByArtist?id=' + artistId);
    }
    this.getSongsByAlbum = function(albumId){
        return $http.get('/api/chords/getSongsByAlbum?id=' + albumId);
    }
    this.checkoutChords = function(songId){
        return $http.get('/api/chords/checkoutChords?id=' + songId);
    }
});

chordsStationApp.controller('dataEntryController', function($scope, dataEntryService){
    $scope.search = function(domain, scope, query){
        if (domain && query){
            console.log(domain + " | " + query);
            if (query.length > 2){
                dataEntryService.search(domain, query).then(function(response){
                    scope.allItems = response.data;
                });
            }
        } else {
            console.log("Invalid Arguments!");
        }
    }
    $scope.pushToArray = function(array, element, display){
        if (array && element){
            if (array.indexOf(element._id) == -1){
                array.push(element._id);
                display.push(element);
            } else {
                console.log("\tElement already Exists.");
            }
        } else {
            console.log("\tInvalid Arguments!");
        }
    }
    $scope.deleteFromArray = function(array, element, display){
        if (array && element){
            var oIndex = array.indexOf(element._id);
            if (oIndex != -1){
                array.splice(oIndex, 1);
                display.splice(oIndex, 1);
            } else {
                console.log("Element doesn't Exist.");
            }
        } else {
            console.log("Invalid Arguments!");
        }
    }
});

chordsStationApp.controller('artistController', function($scope, dataEntryService){
    $scope.thisArtist = {
        albums: []
    };
    $scope.selectedAlbums = [];
    $scope.addArtist = function(thisArtist){
        dataEntryService.addArtist(thisArtist).then(function(response){
            console.log(response);
            Object.keys($scope.thisArtist).forEach(function(thisProp){
                if (typeof $scope.thisArtist[thisProp] == 'string'){
                    $scope.thisArtist[thisProp] = "";
                }
            });
        });
    }
});

chordsStationApp.controller('albumController', function($scope, dataEntryService){
    $scope.thisAlbum = {
        songs: []
    };
    $scope.selectedSongs = [];
    $scope.addAlbum = function(thisAlbum){
        console.log(thisAlbum);
        dataEntryService.addAlbum(thisAlbum).then(function(response){
            console.log(response);
            Object.keys($scope.thisAlbum).forEach(function(thisProp){
                if (typeof $scope.thisAlbum[thisProp] == 'string'){
                    $scope.thisAlbum[thisProp] = "";
                }
            });
        });
    }
});

chordsStationApp.controller('songController', function($scope, dataEntryService){
    $scope.thisSong = {
        featuredArtists: []
    };
    $scope.selectedFtArtists = [];
    $scope.addSong = function(thisSong){
        dataEntryService.addSong(thisSong).then(function(response){
            console.log(response);
            Object.keys($scope.thisSong).forEach(function(thisProp){
                if (typeof $scope.thisSong[thisProp] == 'string'){
                    $scope.thisSong[thisProp] = "";
                }
            });
        });
    }
});

chordsStationApp.controller('chordsController', ['$scope', 'ngYoutubeEmbedService', 'NgTableParams', 'chordsService', function($scope, ngYoutubeEmbedService, NgTableParams, chordsService) {
    function testing(){
        // $scope.videoURL = 'https://www.youtube.com/watch?v=Ff4pwweqGi8';

        // $scope.allReturnedSongs = [{
        //         title: "Aaftaab",
        //         artist: "The Local Train",
        //         album: "Vaaqif",
        //         genre: "Soft, Alternative",
        //         songImage: 'https://a10.gaanacdn.com/images/albums/37/2055837/crop_175x175_2055837.jpg',
        //         youtubeLink: "https://www.youtube.com/watch?v=U77d9912lrw",
        //         releaseDate: "July 14th, 2015"
        //     }
        // ];

        // $scope.allSearchReturnedItems = [{
        //     _id: "12985yijbfsuqhuif0833rjjfn1",
        //     title: "Aaftaab",
        //     songImage: 'https://a10.gaanacdn.com/images/albums/37/2055837/crop_175x175_2055837.jpg',
        // }];
    }
    testing();

    $scope.allSearchReturnedItems = [];
    $scope.search = function (query){
        let allSearchReturnedItems = [];
        if (query.length > 1){
            chordsService.search('song', query).then(function(returnedSongs){
                if (returnedSongs.data){
                    allSearchReturnedItems = allSearchReturnedItems.concat(returnedSongs.data)
                }
                chordsService.search('album', query).then(function(returnedAlbums){
                    if (returnedAlbums.data){
                        allSearchReturnedItems = allSearchReturnedItems.concat(returnedAlbums.data);
                    }
                    chordsService.search('artist', query).then(function(returnedArtists){
                        if (returnedArtists.data){
                            allSearchReturnedItems = allSearchReturnedItems.concat(returnedArtists.data);
                        }
                        $scope.allSearchReturnedItems =  allSearchReturnedItems;
                        console.log("Search Returned Items: ", $scope.allSearchReturnedItems);
                    });
                });
            });
        }
    }

    $scope.allReturnedSongs = [];
    $scope.getDetails = function(thisItem){
        console.log("Getting Details about this song/artist/album: ", thisItem);
        if (thisItem.type == 'Song'){
            console.log("\tSong");
            chordsService.getSongDetails(thisItem._id).then(function(thisSong){
                if (thisSong){
                    thisSong = thisSong.data;
                    // Fix thisSong.releaseDate into Readible Format
                    $scope.allReturnedSongs.push(thisSong);
                }
            });
        } else if (thisItem.type == 'Album'){
            console.log("\tAlbum");
            chordsService.getSongsByAlbum(thisItem._id).then(function(theseSongs){
                if (theseSongs.data && theseSongs.data.length > 0){
                    theseSongs = theseSongs.data;
                    theseSongs.forEach(function(thisSong){
                        chordsService.getSongDetails(thisItem._id).then(function(thisSong){
                            if (thisSong){
                                thisSong = thisSong.data;
                                // Fix thisSong.releaseDate into Readible Format
                                $scope.allReturnedSongs.push(thisSong);
                            }
                        });
                    });
                }
            });
        } else if (thisItem.type == 'Artist'){
            console.log("\tArtist");
            chordsService.getSongsByArtist(thisItem._id).then(function(theseSongs){
                if (theseSongs.data && theseSongs.data.length > 0){
                    theseSongs = theseSongs.data;
                    theseSongs.forEach(function(thisSong){
                        chordsService.getSongDetails(thisItem._id).then(function(thisSong){
                            if (thisSong){
                                thisSong = thisSong.data;
                                // Fix thisSong.releaseDate into Readible Format
                                $scope.allReturnedSongs.push(thisSong);
                            }
                        });
                    });
                }
            });
        }
        console.log("Congratulations! You've selected: " + thisItem._id);
    }

    $scope.checkoutChords = function(thisSong){
        chordsService.checkoutChords(thisSong._id).then(function(theseChords){
            if (theseChords.data){
                theseChords = theseChords.data;
                $scope.thisSongChords = new NgTableParams({}, {
                    dataset: theseChords
                })
            }
        });
    }

    $scope.viewChords = function(thisChord){
        // Initialize Player
        // Start Chords Display Interface
    }
}]);
