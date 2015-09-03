(function () {
  'use strict';

  angular
    .module('main')
    .controller('TrainingsManager', TrainingsManager);

  TrainingsManager.$inject = [
    '$filter',
    '$state',
    '$scope',
    '$mdDialog',
    'moment',
    'logger',
    'TrainingService',
    'AuthenticationService',
    '$ionicLoading'
  ];

  function TrainingsManager(
    $filter,
    $state,
    $scope,
    $mdDialog,
    moment,
    logger,
    TrainingService,
    AuthenticationService,
    $ionicLoading) {
    console.log('Controller [TrainingsManager] started:', this);

    var vm = this;
    vm.title = 'Trainingbeheer';

    vm.showManageTrainingDetails = showManageTrainingDetails;

    vm.showCreateTraining = showCreateTraining;
    vm.cancelCreateTraining = cancelCreateTraining;
    vm.confirmCreateTraining = confirmCreateTraining;

    activate();
    ////////////////////////////////

    function activate() {
      if (!vm.selectedSeasonID) {
        vm.selectedSeasonID = AuthenticationService.getDefaultSeason().SeasonID;
      }

      $ionicLoading.show();
      loadSeasonTrainings();
      $ionicLoading.hide();
    }

    function loadSeasonTrainings() {
      TrainingService.getTrainings(vm.selectedSeasonID)
        .then(function (response) {
          vm.trainings = response.data.Trainings;
        });

    }

    function showManageTrainingDetails(trainingID) {
      $state.go('main.training-manager', {
        trainingID: trainingID,
      });
    }

    function showCreateTraining() {
      vm.newTrainingDate = new Date();
      $mdDialog.show({
        scope: $scope.$new(),
        templateUrl: 'main/templates/training-create.html',
        clickOutsideToClose: true
      });
    }

    function cancelCreateTraining() {
      $mdDialog.cancel();
    }

    function confirmCreateTraining() {
      var dates = vm.trainings.map(function (t) {
        return t.TrainingDate;
      });
      var selectedTraining = moment(vm.newTrainingDate).format('YYYY-MM-DD');
      if (dates.indexOf(selectedTraining) === -1) {
        var saveObject = {
          'SeasonID': vm.selectedSeasonID,
          'TrainingDate': selectedTraining
        };

        $ionicLoading.show();
        TrainingService.createTraining(saveObject)
          .then(function () {
            activate();
            $mdDialog.hide();
          });
      }
    }
  }
})();
