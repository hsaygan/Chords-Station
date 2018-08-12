var chordsStationApp = angular.module("chordsStationApp", []) //ngTable, ui.calendar, ngMaterial

// Angular Material Theme
// .config(function($mdThemingProvider){
//     $mdThemingProvider.theme('docs-dark')
//     .dark()
//     .primaryPalette('light-green')
//     .accentPalette('green');
// });

chordsStationApp.service('chordsService', function($http){
    this.addArtist = function (obj){
        return $http.post('/api/chords/addArtist', obj);
    };
});

chordsStationApp.controller('chordsStationController', function($scope, $http, chordsService){
    $scope.addArtist = function(thisArtist) {
        chordsService.addArtist(thisArtist).then(function(response){
            console.log(response);
        });
    }

    $scope.checkImage = function(thisURL){
        $scope.checkedImage = thisURL;
    }
});
