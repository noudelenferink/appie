(function () {
  'use strict';

  angular
    .module('main')
    .filter('mdate', mdate);

  mdate.$inject = ['moment'];

  function mdate(moment) {
    return function (input, format) {
      if (moment.isDate(input) && !moment.isMoment(input)) {
        return moment(new Date(input)).format(format);
      } else if (moment.isMoment(input) && input.isValid()) {
        return moment(input).format(format);
      } else {
        return '';
      }
    };
  }
})();
