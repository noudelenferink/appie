(function () {
  'use strict';

  angular
    .module('main')
    .controller('TeamManager', TeamManager);

  TeamManager.$inject = [
    '$mdDialog',
    '$filter',
    '$stateParams',
    '$ionicLoading',
    '$scope',
    'logger',
    'AuthenticationService',
    'TeamService',
    'PlayerService'
  ];

  function TeamManager(
    $mdDialog,
    $filter,
    $stateParams,
    $ionicLoading,
    $scope,
    logger,
    AuthenticationService,
    TeamService,
    PlayerService) {
    console.log('Controller [TeamManager] started:', this);

    var vm = this;
    vm.title = 'Teambeheer';

    vm.showAddPlayer = showAddPlayer;
    vm.cancelAddPlayer = cancelAddPlayer;
    vm.addPlayer = addPlayer;
    vm.playerSearch = playerSearch;
    vm.changeSelectedTeam = changeSelectedTeam;

    activate();
    ////////////////////////////////

    function activate() {
      if (!vm.selectedTeam) {
        vm.selectedTeam = AuthenticationService.getDefaultTeam();
      }

      if (!vm.selectedSeason) {
        vm.selectedSeason = AuthenticationService.getDefaultSeason();
      }

      vm.registeredTeams = AuthenticationService.getRegisteredTeams();

      loadTeam(vm.selectedTeam.TeamID, vm.selectedSeason.SeasonID);
    }

    function loadTeam(teamID, seasonID) {
      TeamService.getTeam(teamID, seasonID)
        .then(function (response) {
          vm.team = response.data.Team;
        });
    }

    function changeSelectedTeam(team) {
      vm.selectedTeam = team;
      activate();
    }

    function showAddPlayer() {
      PlayerService.getPlayers()
        .then(function (response) {
          vm.players = response.data.Players;
        });

      $mdDialog.show({
        scope: $scope.$new(),
        templateUrl: 'main/templates/team-player-add.html',
        clickOutsideToClose: true
      });
    }

    function cancelAddPlayer() {
      $mdDialog.cancel();
    }

    function addPlayer() {
      if (vm.selectedPlayer) {
        var newTeamPlayer = {
          'TeamID': vm.selectedTeam.TeamID,
          'PlayerID': vm.selectedPlayer.PlayerID,
          'SeasonID': vm.selectedSeason.SeasonID,
          'EffectiveDate': vm.effectiveDate,
          'JerseyNumber': vm.jerseyNumber ? vm.jerseyNumber : null,
        };
        TeamService.addTeamPlayer(newTeamPlayer)
          .then(function () {
            $mdDialog.hide();
            activate();
          });
      }
    }

    function playerSearch(searchText) {
      var results = searchText ? vm.players.filter(createFilterFor('PlayerName', searchText)) : vm.players;
      return results;
    }

    function createFilterFor(propertyName, searchText) {
      var lowercaseQuery = angular.lowercase(searchText);
      return function filterFn (item) {
        return (angular.lowercase(item[propertyName]).indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();
