(function () {
  'use strict';

  angular
    .module('main')
    .controller('PlayersManager', PlayersManager);

  PlayersManager.$inject = [
    '$filter',
    '$state',
    '$scope',
    '$mdDialog',
    '$ionicLoading',
    'moment',
    'logger',
    'AuthenticationService',
    'PlayerService',
  ];

  function PlayersManager(
    $filter,
    $state,
    $scope,
    $mdDialog,
    $ionicLoading,
    moment,
    logger,
    AuthenticationService,
    PlayerService) {
    console.log('Controller [PlayersManager] started:', this);

    var vm = this;
    vm.title = 'Spelerbeheer';

    vm.showCreatePlayer = showCreatePlayer;
    vm.cancelCreatePlayer = cancelCreatePlayer;
    vm.createPlayer = createPlayer;

    activate();
    ////////////////////////////////

    function activate() {
      if (!vm.selectedSeasonID) {
        vm.selectedSeasonID = AuthenticationService.getDefaultSeason().SeasonID;
      }

      loadPlayers();
    }

    function loadPlayers() {
      PlayerService.getPlayers()
        .then(function (response) {
          vm.players = response.data.Players;
        });
    }

    function showCreatePlayer() {
      $mdDialog.show({
        scope: $scope.$new(),
        templateUrl: 'main/templates/player-create.html',
        clickOutsideToClose: true
      });
    }

    function cancelCreatePlayer() {
      $mdDialog.cancel();
    }

    function createPlayer() {
      var newPlayer = {
        'FirstName': vm.firstName,
        'SurName': vm.surName,
        'SurNamePrefix': vm.surNamePrefix ? vm.surNamePrefix : null,
        'DateOfBirth': vm.dateOfBirth ? vm.dateOfBirth : null,
        'RelationCode': vm.relationCode ? vm.relationCode : null,
        'EmailAddress': vm.emailAddress ? vm.emailAddress : null,
      };

      PlayerService.createPlayer(newPlayer)
        .then(function () {
          activate();
          $mdDialog.hide();
        });
    }
  }
})();
