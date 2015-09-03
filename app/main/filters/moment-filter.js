(function () {
  'use strict';

  angular
    .module('main')
    .filter('mdate', mdate);

  mdate.$inject = ['moment'];

  function mdate(moment) {
    return function (input, format) {
      var dateInput = new Date(input);
      return moment(dateInput).format(format);
    };
  }
})();
