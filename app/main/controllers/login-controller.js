(function () {
  'use strict';

  angular
    .module('main')
    .controller('Login', Login);

  Login.$inject = ['$state', 'ApiService', 'AuthenticationService', 'logger'];

  function Login($state, ApiService, AuthenticationService, logger) {
    console.log('Controller [Login] started:', this);

    var vm = this;
    vm.title = 'Login';

    vm.loginUser = loginUser;

    /////////////////////////////////

    function loginUser() {
      var credentials = {
        'username': vm.username,
        'password': vm.password
      };

      AuthenticationService.processLogin(credentials)
        .then(function () {
          logger.success('Successfully logged in', null);
          $state.go('main.home');
        });
    }
  }
})();
