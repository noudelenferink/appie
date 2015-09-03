(function () {
  'use strict';

  angular
    .module('main')
    .controller('CompetitionRoundManager', CompetitionRoundManager);

  CompetitionRoundManager.$inject = [
    '$scope',
    'logger',
    '$state',
    '$mdDialog',
    '$stateParams',
    'CompetitionService',
    'SoccerMatchService'
  ];

  function CompetitionRoundManager(
    $scope,
    logger,
    $state,
    $mdDialog,
    $stateParams,
    CompetitionService,
    SoccerMatchService) {
    console.log('Controller [CompetitionRoundManager] started:', this);

    var vm = this;
    vm.title = 'Beheer competitieronde';

    vm.showCreateSoccerMatch = showCreateSoccerMatch;
    vm.cancelCreateSoccerMatch = cancelCreateSoccerMatch;
    vm.createSoccerMatch = createSoccerMatch;
    vm.showDeleteSoccerMatchConfirm = showDeleteSoccerMatchConfirm;
    vm.showSoccerMatch = showSoccerMatch;
    vm.usedTeams = usedTeams;

    activate();
    /////////////////////////////

    function activate() {
      getCompetitionRound();
    }

    function getCompetitionRound() {
      CompetitionService.getCompetitionRound($stateParams.id)
        .then(function (response) {
          vm.round = response.data.CompetitionRound;
          vm.selectedCompetitionID = vm.round.CompetitionID;
        });
    }

    function showCreateSoccerMatch($event) {
      CompetitionService.getCompetitionTeams(vm.selectedCompetitionID)
        .then(function (response) {
          vm.teams = response.data.Teams;
        });

      $mdDialog.show({
        targetEvent: $event,
        scope: $scope.$new(),
        templateUrl: 'main/templates/soccer-match-create.html',
        clickOutsideToClose: true
      });
    }

    function usedTeams(team) {
      var usedTeamsIDArray = [];
      vm.round.SoccerMatches.forEach(function (x) {
        usedTeamsIDArray.push(x.HomeTeamID);
        usedTeamsIDArray.push(x.AwayTeamID);
      });

      return usedTeamsIDArray.indexOf(team.TeamID) === -1;
    }

    function cancelCreateSoccerMatch() {
      $mdDialog.cancel();
    }

    function createSoccerMatch() {
      var newSoccerMatch = {
        'HomeTeamID': vm.selectedHomeTeamID,
        'AwayTeamID': vm.selectedAwayTeamID,
        'CompetitionRoundID': $stateParams.id
      };

      logger.log(newSoccerMatch);

      SoccerMatchService.createSoccerMatch(newSoccerMatch)
        .then(function () {
          $mdDialog.hide();
          activate();
        });
    }

    function showSoccerMatch(soccerMatchID) {
      $state.go('main.soccer-match-manager', {
        id: soccerMatchID
      });
    }

    function showDeleteSoccerMatchConfirm(soccerMatch) {
      logger.log(soccerMatch);
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Wedstijd verwijderen')
        .content('Weet je zeker dat je de wedstrijd ' +
          soccerMatch.HomeTeam + ' - ' + soccerMatch.AwayTeam + ' wilt verwijderen?')
        .ok('Verwijderen')
        .cancel('Annuleren')
        .targetEvent(event);
      $mdDialog.show(confirm).then(function () {
        SoccerMatchService.deleteSoccerMatch(soccerMatch.SoccerMatchID)
          .then(function (response) {
            logger.log(response);
            activate();
          });
      }, function () {
        vm.alert = 'You decided to keep your debt.';
      });
    }
  }
})();
