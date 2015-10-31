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
    'aiStorage',
    'jwtHelper',
    'logger',
    'AuthenticationService'
  ];

  function Navigation(
    $scope,
    $state,
    $ionicHistory,
    $mdSidenav,
    $rootScope,
    aiStorage,
    jwtHelper,
    logger,
    AuthenticationService) {
    console.log('Controller [Navigation] started:', this);

    var vm = this;

    vm.toggleSidenav = toggleSidenav;
    vm.navigateBack = navigateBack;
    vm.loginAnonymous = loginAnonymous;
    vm.logout = logout;

    activate();

    ////////////////////////////////

    function activate() {
      var token = aiStorage.get('jwt');
      if (!token || jwtHelper.isTokenExpired(token)) {
        e.preventDefault();
        console.log('token is missing or expired');
        $rootScope.currentUser = null;
        loginAnonymous();
      }  else {
        AuthenticationService.decodeToken(token);
      }
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
        });
    }

    function logout() {
      AuthenticationService.logout();
      loginAnonymous();
    }

    $rootScope.$on('$stateChangeStart', function (e, to) {
      var token = aiStorage.get('jwt');
      if (!token || jwtHelper.isTokenExpired(token)) {
        e.preventDefault();
        console.log('token is missing or expired');
        $rootScope.currentUser = null;
        loginAnonymous();
      }
    });

    $rootScope.$on('$viewContentLoading',
      function (event, toState, toParams, fromState, fromParams) {
        $mdSidenav('left').close();
      });
  }
})();
