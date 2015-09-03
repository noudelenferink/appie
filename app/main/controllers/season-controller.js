(function () {
  'use strict';

  angular
    .module('main')
    .controller('Season', Season);

  Season.$inject = [
    '$scope',
    'logger',
    '$mdDialog',
    'moment',
    'AuthenticationService',
    'SeasonService',
    'CompetitionService'
  ];

  function Season(
    $scope,
    logger,
     $mdDialog,
     moment,
     AuthenticationService,
     SeasonService,
     CompetitionService) {
    console.log('Controller [Season] started:', this);

    var vm = this;
    vm.title = 'Beheer seizoen';

    vm.getSeasons = getSeasons;
    vm.getSeason = getSeason;
    vm.showCreateSeasonMatchday = showCreateSeasonMatchday;
    vm.cancelCreateSeasonMatchday = cancelCreateSeasonMatchday;
    vm.createSeasonMatchday = createSeasonMatchday;
    vm.showCreateSeasonCompetition = showCreateSeasonCompetition;
    vm.cancelCreateSeasonCompetition = cancelCreateSeasonCompetition;
    vm.createSeasonCompetition = createSeasonCompetition;

    activate();

    /////////////////////////////

    function activate() {
      if (!vm.selectedSeasonID) {
        vm.selectedSeasonID = AuthenticationService.getDefaultSeason().SeasonID;
      }

      getSeasons();
      getSeason();
    }

    function getSeasons() {
      SeasonService.getSeasons()
        .then(function (response) {
          vm.seasons = response.data.Seasons;
        });
    }

    function getSeason() {
      SeasonService.getSeason(vm.selectedSeasonID)
        .then(function (response) {
          vm.season = response.data.Season;
        });
    }

    function showCreateSeasonMatchday(ev) {
      vm.newMatchdayDate = new Date();
      $mdDialog.show({
        targetEvent: ev,
        scope: $scope.$new(),
        templateUrl: 'main/templates/matchday-create.html',
        clickOutsideToClose: true
      });
    }

    function cancelCreateSeasonMatchday() {
      $mdDialog.cancel();
    }

    function createSeasonMatchday() {
      var matchdayDate = moment(vm.newMatchdayDate).format('YYYY-MM-DD');
      var saveObject = {
        'SeasonID': vm.selectedSeasonID,
        'MatchdayDate': matchdayDate
      };

      SeasonService.createMatchday(saveObject)
        .then(function () {
          $mdDialog.hide();
          activate();
        });
    }

    function showCreateSeasonCompetition(ev) {
      $mdDialog.show({
        targetEvent: ev,
        scope: $scope.$new(),
        templateUrl: 'main/templates/competition-create.html',
        clickOutsideToClose: true
      });
    }

    function cancelCreateSeasonCompetition() {
      $mdDialog.cancel();
    }

    function createSeasonCompetition() {
      var newCompetition = {
        'SeasonID': vm.selectedSeasonID,
        'Name': vm.newCompetitionName
      };

      CompetitionService.createCompetition(newCompetition)
        .then(function () {
          $mdDialog.hide();
          activate();
        });
    }
  }
})();
