(function () {
  'use strict';

  angular
    .module('main')
    .factory('PlayerService', PlayerService);

  PlayerService.$inject = ['logger', '$http', 'ApiService'];

  function PlayerService(logger, $http, ApiService) {
    var apiUrl = ApiService.getEndpoint();
    var service = {
      getPlayers: getPlayers,
      getPlayerName: getPlayerName,
      createPlayer: createPlayer,
    };

    return service;

    //////////////////////////////////

    function getPlayers() {
      return $http({
          url: apiUrl + '/players',
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getPlayerName(player) {
      if (player.SurNamePrefix) {
        return player.FirstName + ' ' + player.SurNamePrefix + ' ' + player.SurName;
      } else {
        return player.FirstName + ' ' + player.SurName;
      }
    }

    function createPlayer(player) {
      return $http({
          url: apiUrl + '/players',
          method: 'POST',
          data: player,
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }
  }
})();
