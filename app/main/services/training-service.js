(function () {
  'use strict';

  angular
    .module('main')
    .factory('TrainingService', TrainingService);

  TrainingService.$inject = ['logger', '$http', 'ApiService'];

  function TrainingService(logger, $http, ApiService) {
    var apiUrl = ApiService.getEndpoint();

    var service = {
      getTrainings: getTrainings,
      getTraining: getTraining,
      getTrainingsByTeam: getTrainingsByTeam,
      getTrainingOverview: getTrainingOverview,
      getTrainingByTeam: getTrainingByTeam,
      saveTraining: saveTraining,
      createTraining: createTraining,
      deleteTraining: deleteTraining
    };

    return service;

    /////////////////////////////

    function getTrainings(seasonID) {
      return $http({
          url: apiUrl + '/trainings' + '/seasons/' + seasonID,
          method: 'GET'
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getTraining(trainingID) {
      return $http({
          url: apiUrl + '/trainings/' + trainingID,
          method: 'GET',
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getTrainingsByTeam(seasonID, teamID) {
      return $http({
          url: apiUrl + '/trainings' + '/seasons/' + seasonID + '/teams/' + teamID,
          method: 'GET'
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getTrainingOverview(seasonID, teamID) {
      return $http({
          url: apiUrl + '/trainings' + '/training-overview' + '/seasons/' + seasonID + '/teams/' + teamID,
          method: 'GET',
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function getTrainingByTeam(trainingID, teamID) {
      return $http({
          url: apiUrl + '/trainings/' + trainingID + '/teams/' + teamID,
          method: 'GET',
        })
        .success(function (data) {
          console.log('fetched this stuff from server:', data);
        })
        .error(function (error) {
          console.log('an error occured', error);
        });
    }

    function saveTraining(trainingID, saveObject) {
      return $http({
          url: apiUrl + '/trainings/' + trainingID,
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

    function createTraining(saveObject) {
      return $http({
          url: apiUrl + '/trainings',
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

    function deleteTraining(trainingId) {
      return $http({
          url: apiUrl + '/trainings/' + trainingId,
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
