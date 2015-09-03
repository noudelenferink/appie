(function () {
  'use strict';

  angular
    .module('main')
    .factory('TeamService', TeamService);

  TeamService.$inject = ['logger', '$http', 'ApiService'];

  function TeamService(logger, $http, ApiService) {
    var apiUrl = ApiService.getEndpoint();

    var service = {
      getTeams: getTeams,
      getTeam: getTeam,
      addTeamPlayer: addTeamPlayer,
      getTeamLogoPath: getTeamLogoPath
    };

    return service;

    /////////////////////////////

    function getTeams() {
      return $http({
          url: apiUrl + '/teams',
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getTeam(teamID, seasonID) {
      return $http({
          url: apiUrl + '/teams/' + teamID,
          method: 'GET',
          params: { seasonID: seasonID }
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function addTeamPlayer(teamPlayer) {
      return $http({
          url: apiUrl + '/teams/' + teamPlayer.TeamID + '/players',
          method: 'POST',
          data: teamPlayer,
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getTeamLogoPath(imageName) {
      var teamLogoPath = 'main/assets/images/teamlogos/';
      return teamLogoPath + imageName;
    }
  }
})();
