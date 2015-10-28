(function () {
  'use strict';

  angular
    .module('main')
    .controller('SoccerMatchLineupManager', SoccerMatchLineupManager);

  SoccerMatchLineupManager.$inject = [
    '$mdDialog',
    '$scope',
    '$state',
    '$window',
    'logger',
    'MasterDataService',
    'PlayerService'
  ];

  function SoccerMatchLineupManager(
    $mdDialog,
    $scope,
    $state,
    $window,
    logger,
    MasterDataService,
    PlayerService
  ) {

    console.log('Controller [SoccerMatchLineupManager] started:', this);

    var vm = this;
    vm.title = 'Opstelling bewerken';
    vm.soccerMatch = $scope.$parent.vm.soccerMatch;
    vm.loadFormation = loadFormation;
    vm.navigateBack = navigateBack;
    activate();
    ////////////////////////////////

    function activate() {
      if (vm.soccerMatch.FormationID) {
        loadFormation(vm.soccerMatch.FormationID);
      }

      loadFormations();
      loadPlayers();
    }

    function loadFormations() {
      MasterDataService.getFormations()
        .then(function (response) {
          vm.formations = response.data.Formations;
        });
    }

    function loadFormation(formationID) {
      MasterDataService.getFormation(formationID)
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

    function navigateBack() {
      $window.history.back();
    }
  }
})();
