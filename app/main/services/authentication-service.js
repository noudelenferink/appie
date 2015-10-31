(function () {
  'use strict';

  angular
    .module('main')
    .factory('AuthenticationService', AuthenticationService);

  AuthenticationService.$inject = ['$http', 'ApiService', 'aiStorage', 'jwtHelper', 'logger'];

  function AuthenticationService($http, ApiService, aiStorage, jwtHelper, logger) {
    var currentUser = null;
    var isUserLoggedIn = false;
    var defaultSeason = null;
    var defaultTeam = null;
    var registeredTeams = null;

    var service = {
      processLogin: processLogin,
      logout: logout,
      getIsUserLoggedIn: getIsUserLoggedIn,
      getCurrentUser: getCurrentUser,
      getDefaultSeason: getDefaultSeason,
      getDefaultCompetitionID: getDefaultCompetitionID,
      getDefaultTeam: getDefaultTeam,
      getRegisteredTeams: getRegisteredTeams,
      decodeToken: decodeToken,
    };

    return service;

    ///////////////

    function getCurrentUser() {
      return currentUser;
    }

    function getIsUserLoggedIn() {
      return isUserLoggedIn;
    }

    function getDefaultSeason() {
      return defaultSeason;
    }

    function getRegisteredTeams() {
      return registeredTeams;
    }

    function getDefaultCompetitionID() {
      return 7;
    }

    function getDefaultTeam() {
      return defaultTeam;
    }

    function decodeToken(token, credentials) {
      var decodedToken = token && jwtHelper.decodeToken(token);
      if (decodedToken) {
        logger.log(decodedToken);
        defaultSeason = decodedToken.seasons[0]; // TODO: Refactor to seasosn with default season
        registeredTeams = decodedToken.teams;
        defaultTeam = decodedToken.teams[1]; // TODO: Refactor to registeredTeams with default team
        if (credentials) {
          isUserLoggedIn = true;
          currentUser = {};
          currentUser.username = decodedToken.username;
          currentUser.roles = decodedToken.roles ? decodedToken.roles : [];
          logger.success('User ' + currentUser.username + ' succesfully logged in');
        } else {
          isUserLoggedIn = false;
        }
      }
    }

    function processLogin(credentials) {
      var apiUrl = ApiService.getEndpoint();

      return $http({
          url: apiUrl + '/login',
          method: 'POST',
          data: credentials ? credentials : ApiService.getDefaultCredentials(),
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
          aiStorage.set('jwt', data);
          decodeToken(data, credentials);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function logout() {
      aiStorage.remove('jwt');
      currentUser = null;
    }
  }
})();
