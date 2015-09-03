(function () {
  'use strict';

  angular
    .module('main')
    .controller('CompetitionManager', CompetitionManager);

  CompetitionManager.$inject = [
    '$scope',
    '$state',
    'logger',
    '$mdDialog',
    'CompetitionService',
    'SeasonService',
    'AuthenticationService',
    'TeamService'
  ];

  function CompetitionManager(
    $scope,
    $state,
    logger,
    $mdDialog,
    CompetitionService,
    SeasonService,
    AuthenticationService,
    TeamService) {
    console.log('Controller [CompetitionManager] started:', this);

    var vm = this;
    vm.title = 'Beheer competitie';

    vm.getCompetition = getCompetition;
    vm.getCompetitionTeams = getCompetitionTeams;
    vm.getTeamLogo = getTeamLogo;
    vm.showCompetitionSelector = showCompetitionSelector;
    vm.cancelCompetitionSelector = cancelCompetitionSelector;
    vm.selectCompetition = selectCompetition;
    vm.getSeasonCompetitions = getSeasonCompetitions;
    vm.showCreateCompetitionRound = showCreateCompetitionRound;
    vm.cancelCreateCompetitionRound = cancelCreateCompetitionRound;
    vm.createCompetitionRound = createCompetitionRound;
    vm.showCompetitionRound = showCompetitionRound;
    vm.usedMatchdays = usedMatchdays;
    vm.showAddTeam = showAddTeam;
    vm.cancelAddTeam = cancelAddTeam;
    vm.addTeam = addTeam;

    activate();

    /////////////////////////////

    function activate() {
      if (!vm.selectedSeason) {
        vm.selectedSeason = AuthenticationService.getDefaultSeason();
      }

      if (!vm.selectedCompetitionID) {
        vm.selectedCompetitionID = AuthenticationService.getDefaultCompetitionID();
      }

      getCompetition();
      //getCompetitionTeams();
    }

    function getCompetition() {
      CompetitionService.getCompetition(vm.selectedCompetitionID)
        .then(function (response) {
          vm.competition = response.data.Competition;
        });
    }

    function getCompetitionTeams() {
      CompetitionService.getCompetitionTeams(vm.selectedCompetitionID)
        .then(function (response) {
          vm.teams = response.data.Teams;
        });
    }

    function getSeasonCompetitions() {
      CompetitionService.getCompetitionsBySeason(vm.selectedSeason.SeasonID)
        .then(function (response) {
          vm.competitions = response.data.Competitions;
        });
    }

    function showCompetitionSelector($event) {
      SeasonService.getSeasons()
        .then(function (response) {
          vm.seasons = response.data.Seasons;
        });

      vm.getSeasonCompetitions();
      vm.tempCompetitionID = vm.selectedCompetitionID;
      $mdDialog.show({
        targetEvent: $event,
        scope: $scope.$new(),
        templateUrl: 'main/templates/competition-select.html',
        clickOutsideToClose: true
      });
    }

    function cancelCompetitionSelector() {
      $mdDialog.cancel();
    }

    function selectCompetition() {
      vm.selectedCompetitionID = vm.tempCompetitionID;
      vm.getCompetition();
      $mdDialog.hide();
    }

    function showCreateCompetitionRound(ev) {
      // TODO: Pass along earlier retrieved season data
      SeasonService.getSeason(vm.selectedSeason.SeasonID)
        .then(function (response) {
          vm.matchdays = response.data.Season.Matchdays;
        });

      $mdDialog.show({
        targetEvent: ev,
        scope: $scope.$new(),
        templateUrl: 'main/templates/competition-round-create.html',
        clickOutsideToClose: true
      });
    }

    function cancelCreateCompetitionRound() {
      $mdDialog.cancel();
    }

    function createCompetitionRound() {
      var newCompetitionRound = {
        'CompetitionID': vm.selectedCompetitionID,
        'MatchdayID': vm.selectedMatchdayID,
        'RoundNumber': vm.roundNumber,
        'Description': !vm.description ? null : vm.description
      };
      logger.log(newCompetitionRound);
      CompetitionService.createCompetitionRound(newCompetitionRound)
        .then(function () {
          $mdDialog.hide();
          activate();
        });
    }

    function showCompetitionRound(competitionRoundID) {
      $state.go('main.competition-round-manager', {
        id: competitionRoundID
      });
    }

    function usedMatchdays(matchday) {
      var usedMatchdayIDArray = vm.competition.Rounds.map(function (x) {
        return x.MatchdayID;
      });
      return usedMatchdayIDArray.indexOf(matchday.MatchdayID) === -1;
    }

    function getTeamLogo(imageName) {
      var teamLogoPath = 'main/assets/images/teamlogos/';
      return teamLogoPath + imageName;
    }

    function showAddTeam(ev) {
      TeamService.getTeams()
        .then(function (response) {
          vm.teams = response.data.Teams;
        });

      $mdDialog.show({
        targetEvent: ev,
        scope: $scope.$new(),
        templateUrl: 'main/templates/competition-team-add.html',
        clickOutsideToClose: true
      });
    }

    function cancelAddTeam() {
      $mdDialog.cancel();
    }

    function addTeam() {
      var newCompetitionTeam = {
        'CompetitionID': vm.selectedCompetitionID,
        'TeamID': vm.selectedTeamID,
        'DefaultStartTime': vm.startTime ? vm.startTime : null,
      };
      logger.log(newCompetitionTeam);
      CompetitionService.createCompetitionTeam(newCompetitionTeam)
        .then(function () {
          $mdDialog.hide();
          activate();
        });
    }
  }
})();
