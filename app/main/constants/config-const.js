(function () {
  'use strict';

  angular
    .module('main')
    .constant('Config', {

      // gulp environment: injects environment vars
      // https://github.com/mwaylabs/generator-m#gulp-environment
      ENV: {
        /*inject-env*/
        'API_ENDPOINT': {
  'host': 'https://www.nifnic.nl',
  'path': '/appie-api/v1',
  'needsAuth': 'true',
  'defaultUser': 'anonymous',
  'defaultPassword': '4HhDd986yn11Dkf'
}
        /*endinject*/
      },

      // gulp build-vars: injects build vars
      // https://github.com/mwaylabs/generator-m#gulp-build-vars
      BUILD: {
        /*inject-build*/
        /*endinject*/
      }

    });
})();
