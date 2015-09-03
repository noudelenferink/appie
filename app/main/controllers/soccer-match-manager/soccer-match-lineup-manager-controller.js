(function () {
  'use strict';

  angular
    .module('main')
    .controller('SoccerMatchLineupManager', SoccerMatchLineupManager);

  SoccerMatchLineupManager.$inject = [
    '$mdDialog',
    '$scope',
    '$state',
    'logger',
    'MasterDataService',
    'PlayerService'
  ];

  function SoccerMatchLineupManager(
    $mdDialog,
    $scope,
    $state,
    logger,
    MasterDataService,
    PlayerService
  ) {

    console.log('Controller [SoccerMatchLineupManager] started:', this);

    var vm = this;
    vm.title = 'Opstelling bewerken';

    vm.loadFormation = loadFormation;

    activate();
    ////////////////////////////////

    function activate() {
      // if(vm.soccerMatch.FormationID) {
      //   getFormation(vm.soccerMatch.FormationID);
      // }

      loadFormations();
      loadPlayers();
    }

    function loadFormations() {
      MasterDataService.getFormations()
        .then(function (response) {
          vm.formations = response.data.Formations;
        });
    }

    function loadFormation() {
      MasterDataService.getFormation(vm.formationID)
        .then(function (response) {
          vm.formation = response.data.Formation;
        });
    }

    function loadPlayers() {
      PlayerService.getPlayers()
        .then(function (response) {
          vm.players = response.data.Players;
        });
    }
  }
})();
