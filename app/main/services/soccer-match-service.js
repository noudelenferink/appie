(function () {
  'use strict';

  angular
    .module('main')
    .factory('SoccerMatchService', SoccerMatchService);

  SoccerMatchService.$inject = [
    'logger',
    '$http',
    'ApiService'
  ];

  function SoccerMatchService(logger, $http, ApiService) {
    var apiUrl = ApiService.getEndpoint();

    var service = {
      getSoccerMatch: getSoccerMatch,
      updateSoccerMatch: updateSoccerMatch,
      createSoccerMatch: createSoccerMatch,
      deleteSoccerMatch: deleteSoccerMatch,

      getSoccerMatchesByCompetition: getSoccerMatchesByCompetition,

      getEvents: getEvents,
      createSoccerMatchEvent: createSoccerMatchEvent,
      deleteSoccerMatchEvent: deleteSoccerMatchEvent
    };

    return service;

    /////////////////////////////

    function getSoccerMatch(soccerMatchID) {
      return $http({
          url: apiUrl + '/soccer-matches/' + soccerMatchID,
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function updateSoccerMatch(soccerMatch) {
      return $http({
          url: apiUrl + '/soccer-matches/' + soccerMatch.SoccerMatchID,
          method: 'PUT',
          data: soccerMatch
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function createSoccerMatch(soccerMatch) {
      return $http({
          url: apiUrl + '/soccer-matches',
          method: 'POST',
          data: soccerMatch
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function deleteSoccerMatch(soccerMatchID) {
      return $http({
          url: apiUrl + '/soccer-matches/' + soccerMatchID,
          method: 'DELETE',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getSoccerMatchesByCompetition(competitionID) {
      return $http({
          url: apiUrl + '/competitions/' + competitionID + '/soccer-matches',
          method: 'GET'
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getEvents() {
      return $http({
          url: apiUrl + '/events',
          method: 'GET'
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function createSoccerMatchEvent(newSoccerMatchEvent) {
      return $http({
          url: apiUrl + '/soccer-matches/' + newSoccerMatchEvent.SoccerMatchID + '/events',
          method: 'POST',
          data: newSoccerMatchEvent
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function deleteSoccerMatchEvent(soccerMatchID, soccerMatchEventID) {
      return $http({
          url: apiUrl + '/soccer-matches/' + soccerMatchID + '/events/' + soccerMatchEventID,
          method: 'DELETE',
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
