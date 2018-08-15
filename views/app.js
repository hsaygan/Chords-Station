var chordsStationApp = angular.module("chordsStationApp", ['ngMaterial']);

chordsStationApp.config(function($mdThemingProvider){
    $mdThemingProvider.theme('docs-dark')
    .dark()
    .primaryPalette('light-blue')
    .accentPalette('blue');
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
                console.log("Element already Exists.");
            }
        } else {
            console.log("Invalid Arguments!");
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
        console.log(thisArtist);
        dataEntryService.addArtist(thisArtist).then(function(response){
            console.log(response);
            Object.keys($scope.artistScope.thisArtist).forEach(function(thisProp){
                console.log("\t" + thisProp);
                $scope.artistScope.thisArtist[thisProp] = "";
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
            Object.keys($scope.albumScope.thisAlbum).forEach(function(thisProp){
                $scope.albumScope.thisAlbum[thisProp] = "";
            });
        });
    }
});
