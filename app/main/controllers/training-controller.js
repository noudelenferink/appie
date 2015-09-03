(function () {
  'use strict';

  angular
    .module('main')
    .controller('Training', Training);

  Training.$inject = [
    '$filter',
    '$stateParams',
    'logger',
    'TrainingService',
    'AuthenticationService'
  ];

  function Training($filter, $stateParams, logger, TrainingService, AuthenticationService) {
    console.log('Controller [Training] started:', this);

    var vm = this;
    vm.title = 'Training';

    vm.changeSelectedTeam = changeSelectedTeam;

    activate();
    ////////////////////////////////

    function activate() {
      vm.registeredTeams = AuthenticationService.getRegisteredTeams();

      if (!vm.selectedTeam) {
        var teamID = $stateParams.teamID ? $stateParams.teamID : AuthenticationService.getDefaultTeamID();
        vm.selectedTeam = $filter('first')($filter('where')(vm.registeredTeams, {
          'TeamID': teamID
        }));
      }

      loadTraining($stateParams.trainingID, vm.selectedTeam.TeamID);
    }

    function loadTraining(trainingID, teamID) {
      TrainingService.getTrainingByTeam(trainingID, teamID)
        .then(function (response) {
          vm.training = response.data.Training;
        });
    }

    function changeSelectedTeam(t) {
      vm.selectedTeam = t;
      activate();
    }
  }
})();
