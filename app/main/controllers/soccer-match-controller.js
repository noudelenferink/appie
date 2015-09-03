(function () {
  'use strict';

  angular
    .module('main')
    .controller('SoccerMatch', SoccerMatch);

  SoccerMatch.$inject = [
    '$filter',
    '$stateParams',
    '$ionicHistory',
    'logger',
    'SoccerMatchService',
    'AuthenticationService'
  ];

  function SoccerMatch(
    $filter,
    $stateParams,
    $ionicHistory,
    logger,
    SoccerMatchService,
    AuthenticationService) {

    console.log('Controller [SoccerMatch] started:', this);

    var vm = this;
    vm.title = 'Wedstrijd';

    activate();
    ////////////////////////////////

    function activate() {
      loadSoccerMatch();
    }

    function loadSoccerMatch() {
      SoccerMatchService.getSoccerMatch($stateParams.soccerMatchID)
        .then(function (response) {
          vm.soccerMatch = response.data.SoccerMatch;
          vm.soccerMatch.Events.forEach(function (x) {
            if (x.ReferenceSoccerMatchEventID) {
              var indexRoot = vm.soccerMatch.Events.map(function (y) {
                return y.SoccerMatchEventID;
              }).indexOf(x.ReferenceSoccerMatchEventID);
              vm.soccerMatch.Events[indexRoot].ReferenceEvent = x;
            }
          });
        });
    }
  }
})();
