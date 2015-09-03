(function () {
  'use strict';

  angular
    .module('main')
    .controller('Navigation', Navigation);

  Navigation.$inject = [
    '$scope',
    '$state',
    '$ionicHistory',
    '$mdSidenav',
    '$rootScope',
    'logger',
    'AuthenticationService'
  ];

  function Navigation($scope, $state, $ionicHistory, $mdSidenav, $rootScope, logger, AuthenticationService) {
    console.log('Controller [Navigation] started:', this);

    var vm = this;

    vm.toggleSidenav = toggleSidenav;
    vm.navigateBack = navigateBack;
    vm.loginAnonymous = loginAnonymous;
    vm.logout = logout;

    activate();

    ////////////////////////////////

    function activate() {
      vm.loginAnonymous();

      $scope.$watch(AuthenticationService.getIsUserLoggedIn, function (current, original) {
        vm.isUserLoggedIn = current;
        vm.currentUser = AuthenticationService.getCurrentUser();
      });
    }

    function navigateBack() {
      $ionicHistory.goBack();
    }

    function toggleSidenav() {
      $mdSidenav('left').toggle();
    }

    function loginAnonymous() {
      AuthenticationService.processLogin()
        .then(function () {
          $state.go('main.home');
        });
    }

    function logout() {
      AuthenticationService.logout();
      loginAnonymous();
    }

    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams, fromState, fromParams) {
        $mdSidenav('left').close();
      });
  }
})();
