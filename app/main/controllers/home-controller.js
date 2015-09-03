(function () {
  'use strict';

  angular
    .module('main')
    .controller('Home', Home);

  Home.$inject = ['logger', '$ionicHistory', '$ionicLoading', '$timeout'];

  function Home(logger, $ionicHistory, $ionicLoading, $timeout) {
    console.log('Controller [Home] started:', this);
    var vm = this;
    vm.title = 'Home';

    activate();

    /////////////////////////////

    function activate () {

    }
  }
})();
