(function () {
  'use strict';

  angular
    .module('main')
    .controller('SoccerMatchManager', SoccerMatchManager);

  SoccerMatchManager.$inject = [
    '$mdDialog',
    '$scope',
    '$filter',
    'logger',
    '$state',
    '$stateParams',
    'SoccerMatchService',
    'TeamService',
  ];

  function SoccerMatchManager(
    $mdDialog,
    $scope,
    $filter,
    logger,
    $state,
    $stateParams,
    SoccerMatchService,
    TeamService) {
    console.log('Controller [SoccerMatchManager] started:', this);

    var vm = this;
    vm.title = 'Beheer wedstrijd';
    vm.saveSoccerMatch = saveSoccerMatch;
    vm.showCreateSoccerMatchEvent = showCreateSoccerMatchEvent;
    vm.cancelAddSoccerMatchEvent = cancelAddSoccerMatchEvent;
    vm.addSoccerMatchEvent = addSoccerMatchEvent;
    vm.deleteSoccerMatchEvent = deleteSoccerMatchEvent;
    vm.gotoLineupManager = gotoLineupManager;

    activate();

    /////////////////////////////

    function activate() {
      getSoccerMatch();
    }

    function getSoccerMatch() {
      SoccerMatchService.getSoccerMatch($stateParams.id)
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

    function getEvents() {
      SoccerMatchService.getEvents()
        .then(function (response) {
          vm.events = response.data.Events;
        });
    }

    function getTeamPlayers() {
      vm.players = [];
      TeamService.getTeam(vm.soccerMatch.HomeTeamID, vm.soccerMatch.SeasonID)
        .then(function (response) {
          response.data.Team.Players.forEach(function (item) {
            item.TeamID = vm.soccerMatch.HomeTeamID;
            vm.players.push(item);
          });
        });

      TeamService.getTeam(vm.soccerMatch.AwayTeamID, vm.soccerMatch.SeasonID)
        .then(function (response) {
          response.data.Team.Players.forEach(function (item) {
            item.TeamID = vm.soccerMatch.AwayTeamID;
            vm.players.push(item);
          });
        });
    }

    function saveSoccerMatch(ev) {
      var updatedSoccerMatch = {
        'SoccerMatchID': $stateParams.id,
        'HomeGoals': vm.soccerMatch.HomeGoals,
        'AwayGoals': vm.soccerMatch.AwayGoals
      };

      SoccerMatchService.updateSoccerMatch(updatedSoccerMatch)
        .then(function (response) {
          logger.success('Soccer match successfully saved.');
          activate();
        });

    }

    function gotoLineupManager() {
      $state.transitionTo('main.soccer-match-manager.lineup');
    }

    function showCreateSoccerMatchEvent($event) {
      if (!vm.events) {
        getEvents();
      }

      if (!vm.homeTeamPlayers && !vm.awayTeamPlayers) {
        getTeamPlayers();
      }

      $mdDialog.show({
        targetEvent: $event,
        scope: $scope.$new(),
        templateUrl: 'main/templates/soccer-match-event-create.html',
        clickOutsideToClose: true
      });
    }

    function cancelAddSoccerMatchEvent() {
      $mdDialog.cancel();
    }

    function deleteSoccerMatchEvent(soccerMatchEventID) {
      SoccerMatchService.deleteSoccerMatchEvent($stateParams.id, soccerMatchEventID)
        .then(function (response) {
          activate();
        });
    }

    function addSoccerMatchEvent() {
      var newSoccerMatchEvent = {
        'SoccerMatchID': vm.soccerMatch.SoccerMatchID,
        'Minute': vm.newEvent.Minute,
        'EventID': vm.newEvent.EventID,
        'PlayerID': vm.newEvent.PlayerID
      };

      SoccerMatchService.createSoccerMatchEvent(newSoccerMatchEvent)
        .then(function (response) {
          var arr = $filter('toArray')(vm.newEvent.References, true);
          if (arr) {
            arr.forEach(function (item) {
              if (item.HasReference) {
                var newReferenceEvent = {
                  'ReferenceSoccerMatchEventID': response.data.SoccerMatchEventID,
                  'SoccerMatchID': vm.soccerMatch.SoccerMatchID,
                  'Minute': vm.newEvent.Minute,
                  'EventID': item.$key,
                  'PlayerID': item.PlayerID ? item.PlayerID : null
                };

                SoccerMatchService.createSoccerMatchEvent(newReferenceEvent)
                  .then(function () {

                  });
              }
            });
          }

          activate();
          $mdDialog.hide();
        });
    }
  }
})();
