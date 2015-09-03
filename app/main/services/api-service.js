(function () {
  'use strict';

  angular
    .module('main')
    .factory('ApiService', ApiService);

  ApiService.$inject = ['Config'];

  function ApiService(Config) {
    var apiSettings = Config.ENV.API_ENDPOINT;

    var service = {
      getEndpoint: getEndpoint,
      getDefaultCredentials: getDefaultCredentials,
    };

    return service;

    ////////////////////

    function getEndpoint() {
      var endpoint = apiSettings.port ? (apiSettings.host + ':' + apiSettings.port + apiSettings.path)
                                      : (apiSettings.host + apiSettings.path);

      return endpoint;
    }

    function getDefaultCredentials() {
      var defaultCredentials = {};
      defaultCredentials.username = apiSettings.defaultUser;
      defaultCredentials.password = apiSettings.defaultPassword;

      return defaultCredentials;
    }
  }
})();
