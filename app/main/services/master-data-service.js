(function () {
  'use strict';

  angular
    .module('main')
    .factory('MasterDataService', MasterDataService);

  MasterDataService.$inject = ['logger', '$http', 'ApiService'];

  function MasterDataService(logger, $http, ApiService) {
    var apiUrl = ApiService.getEndpoint();
    var service = {
      getEvents: getEvents,
      getFormations: getFormations,
      getFormation: getFormation
    };

    return service;

    //////////////////////////////////

    function getEvents() {
      return $http({
          url: apiUrl + '/events',
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getFormations() {
      return $http({
          url: apiUrl + '/formations',
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }

    function getFormation(formationID) {
      return $http({
          url: apiUrl + '/formations/' + formationID,
          method: 'GET',
        })
        .success(function (data) {
          logger.success('fetched this stuff from server:', data);
        })
        .error(function (error) {
          logger.error('an error occured', error);
        });
    }
  }
})();
