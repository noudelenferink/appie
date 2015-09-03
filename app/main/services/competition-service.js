(function () {
  'use strict';

  angular
    .module('main')
    .factory('CompetitionService', CompetitionService);

  CompetitionService.$inject = ['logger', '$http', 'ApiService', 'aiStorage'];

  function CompetitionService(logger, $http, ApiService, aiStorage) {
    var apiUrl = ApiService.getEndpoint();

    var service = {
      getCompetitionsBySeason: getCompetitionsBySeason,
      getCompetition: getCompetition,
      createCompetition: createCompetition,
      createCompetitionRound: createCompetitionRound,
      getCompetitionRound: getCompetitionRound,
      getCompetitionTeams: getCompetitionTeams,
      getCompetitionStatsForTeam: getCompetitionStatsForTeam,
      createCompetitionTeam: createCompetitionTeam
    };

    return service;

    /////////////////////////////

    function getCompetitionsBySeason(seasonID) {
      return $http({
          url: apiUrl + '/seasons/' + seasonID + '/competitions',
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getCompetition(competitionID) {
      return $http({
          url: apiUrl + '/competitions/' + competitionID,
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function createCompetition(competition) {
      return $http({
          url: apiUrl + '/competitions',
          method: 'POST',
          data: competition,
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function createCompetitionRound(competitionRound) {
      return $http({
          url: apiUrl + '/competitions/' + competitionRound.CompetitionID + '/competition-rounds',
          method: 'POST',
          data: competitionRound,
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getCompetitionRound(competitionRoundID) {
      return $http({
          url: apiUrl + '/competition-rounds/' + competitionRoundID,
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getCompetitionTeams(competitionID) {
      return $http({
          url: apiUrl + '/competitions/' + competitionID + '/teams',
          method: 'GET',
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getCompetitionStatsForTeam(competitionID, teamID) {
      return $http({
          url: apiUrl + '/competitions/' + competitionID + '/team-stats/' + teamID,
          method: 'GET',
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function createCompetitionTeam(competitionTeam) {
      return $http({
          url: apiUrl + '/competitions/' + competitionTeam.CompetitionID + '/teams',
          method: 'POST',
          data: competitionTeam,
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
