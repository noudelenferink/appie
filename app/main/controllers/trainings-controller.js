(function () {
  'use strict';

  angular
    .module('main')
    .controller('Trainings', Trainings);

  Trainings.$inject = [
    '$filter',
    '$state',
    'logger',
    'TrainingService',
    'AuthenticationService',
    '$ionicLoading'
  ];

  function Trainings($filter, $state, logger, TrainingService, AuthenticationService, $ionicLoading) {
    console.log('Controller [Trainings] started:', this);

    var vm = this;
    vm.title = 'Trainingen';

    vm.changeSelectedTeam = changeSelectedTeam;
    vm.showTrainingDetails = showTrainingDetails;
    vm.showPlayerDetails = showPlayerDetails;

    activate();
    ////////////////////////////////

    function activate() {
      if (!vm.selectedTeam) {
        vm.selectedTeam = AuthenticationService.getDefaultTeam();
      }

      if (!vm.selectedSeasonID) {
        vm.selectedSeasonID = AuthenticationService.getDefaultSeason().SeasonID;
      }

      vm.registeredTeams = AuthenticationService.getRegisteredTeams();
      $ionicLoading.show();
      loadSeasonTrainings();
      loadTrainingOverview();
      $ionicLoading.hide();
    }

    function loadSeasonTrainings() {
      TrainingService.getTrainingsByTeam(vm.selectedSeasonID, vm.selectedTeam.TeamID)
        .then(function (response) {
          vm.trainings = response.data.Trainings;
        });
    }

    function loadTrainingOverview() {
      TrainingService.getTrainingOverview(vm.selectedSeasonID, vm.selectedTeam.TeamID)
        .then(function (response) {
          vm.trainingOverview = response.data.TrainingOverview;
        });
    }

    function changeSelectedTeam(t) {
      vm.selectedTeam = t;
      activate();
    }

    function showTrainingDetails(trainingID) {
      $state.go('main.training', {
        trainingID: trainingID,
        teamID: vm.selectedTeam.TeamID
      });
    }

    function showPlayerDetails(playerID) {
      $state.go('main.player', {
        id: playerID
      });
    }
  }
})();
