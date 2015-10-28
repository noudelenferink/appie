(function () {
  'use strict';

  angular
    .module('main')
    .filter('fullname', Fullname);

  function Fullname() {
    return function (player) {
      if (!player || (!player.FirstName && !player.SurName)) {
        return undefined;
      }
      if (player.SurNamePrefix) {
        return player.FirstName + ' ' + player.SurNamePrefix + ' ' + player.SurName;
      } else {
        return player.FirstName + ' ' + player.SurName;
      }
    };
  }
})();
