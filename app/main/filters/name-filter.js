(function () {
  'use strict';

  angular
    .module('main')
    .filter('fullname', Fullname);

  function Fullname() {
    return function (player) {
      if (player.SurNamePrefix) {
        return player.FirstName + ' ' + player.SurNamePrefix + ' ' + player.SurName;
      } else {
        return player.FirstName + ' ' + player.SurName;
      }
    };
  }
})();
