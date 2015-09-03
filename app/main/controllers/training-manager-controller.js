(function () {
  'use strict';

  angular
    .module('main')
    .controller('TrainingManager', TrainingManager);

  TrainingManager.$inject = [
    '$filter',
    '$state',
    '$stateParams',
    '$mdDialog',
    '$scope',
    'logger',
    'TrainingService',
    'AuthenticationService',
    '$ionicLoading'
  ];

  function TrainingManager(
    $filter,
    $state,
    $stateParams,
    $mdDialog,
    $scope,
    logger,
    TrainingService,
    AuthenticationService,
    $ionicLoading) {
    console.log('Controller [TrainingManager] started:', this);

    var vm = this;
    vm.title = 'Training bewerken';

    vm.loadTraining = loadTraining;
    vm.updateNumAttended = updateNumAttended;
    vm.undoChanges = undoChanges;
    vm.modifiedFilter = modifiedFilter;
    vm.attendedFilter = attendedFilter;
    vm.anyChanges = anyChanges;

    vm.saveTraining = saveTraining;
    vm.cancelSaveTraining = cancelSaveTraining;
    vm.confirmSaveTraining = confirmSaveTraining;
    vm.showConfirmDeleteTraining = showConfirmDeleteTraining;

    activate();
    ////////////////////////////////

    function activate() {
      loadTraining($stateParams.trainingID);
    }

    function loadTraining(trainingID) {
      TrainingService.getTraining(trainingID)
        .then(function (response) {
          vm.training = response.data.Training;
          vm.origTraining = angular.copy(vm.training);
        });
    }

    function updateNumAttended(item) {
      item.Modified = !item.Modified;
    }

    function undoChanges() {
      vm.training = angular.copy(vm.origTraining);
    }

    function anyChanges() {
      if (!vm.training || !vm.training.Attendees) {
        return false;
      }

      return vm.training.Attendees.filter(vm.modifiedFilter).length > 0;
    }

    function modifiedFilter(item) {
      return item.Modified;
    }

    function attendedFilter(item) {
      return item.HasAttended;
    }

    function saveTraining() {
      $mdDialog.show({
        scope: $scope.$new(),
        templateUrl: 'main/templates/training-confirm-save.html',
        clickOutsideToClose: true
      });
    }

    function cancelSaveTraining() {
      $mdDialog.cancel();
    }

    function confirmSaveTraining() {
      var saveObject = {};
      saveObject.Attendees = [];
      var changes = vm.training.Attendees.filter(vm.modifiedFilter);
      changes.map(function (ta) {
        var item = {
          'PlayerID': ta.PlayerID,
          'HasAttended': ta.HasAttended
        };

        saveObject.Attendees.push(item);
      });

      TrainingService.saveTraining(vm.training.TrainingID, saveObject)
        .then(function () {
          activate();
          $mdDialog.hide();
        });
    }

    function showConfirmDeleteTraining() {
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Weet je zeker dat je deze training wilt verwijderen?')
        .content('')
        .ok('Verwijderen')
        .cancel('Annuleren');

      $mdDialog.show(confirm).then(function () {
        TrainingService.deleteTraining(vm.training.TrainingID)
          .then(function () {
            $state.go('main.trainings-manager');
          });
      });
    }
  }
})();
