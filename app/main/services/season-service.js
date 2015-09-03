(function () {
  'use strict';

  angular
    .module('main')
    .factory('SeasonService', SeasonService);

  SeasonService.$inject = ['logger', '$http', 'ApiService'];

  function SeasonService(logger, $http, ApiService) {
    var apiUrl = ApiService.getEndpoint();
    var service = {
      getSeasons: getSeasons,
      getSeason: getSeason,
      createMatchday: createMatchday
    };

    return service;

    /////////////////////////////

    function getSeasons() {
      return $http({
          url: apiUrl + '/seasons',
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getSeason(seasonID) {
      return $http({
          url: apiUrl + '/seasons/' + seasonID,
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function createMatchday(saveObject) {
      return $http({
          url: apiUrl + '/matchdays',
          method: 'POST',
          data: saveObject,
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
