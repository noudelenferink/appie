(function () {
  'use strict';

  angular
    .module('main')
    .filter('mdate', mdate);

  mdate.$inject = ['moment'];

  function mdate(moment) {
    return function (input, format) {
      if (!input) {
        return '';
      }

      if (moment.isDate(input) || (moment.isDate(new Date(input)) && moment(new Date(input)).isValid())) {
        return moment(new Date(input)).format(format);
      } else if (moment(input, format).isValid()) {
        return moment(input, format).format(format);
      } else {
        return '';
      }
    };
  }
})();
