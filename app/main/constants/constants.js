(function () {
  'use strict';

  /*jslint maxlen: 500 */
  /* global toastr:false, moment:false */
  angular
    .module('main')
    .constant('toastr', toastr)
    .constant('moment', moment)

    .constant('REGEX_PATTERNS', {
      'DateRegex': new RegExp(/^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/)
    });
})();
