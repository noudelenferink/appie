(function () {
  'use strict';

  angular
    .module('main')
    .directive('soccermatchevent', soccermatchevent);

  soccermatchevent.$inject = [
    '$compile',
    '$http',
    '$templateCache'
  ];

  function soccermatchevent($compile, $http, $templateCache) {
    var getTemplate = function (contentType) {
      var templateLoader,
        baseUrl = 'main/templates/soccer-match-event/',
        templateMap = {
          1: 'goal.html',
          4: 'substitute.html',
        };

      var templateUrl = baseUrl + templateMap[contentType];
      templateLoader = $http.get(templateUrl, {
        cache: $templateCache
      });

      return templateLoader;

    };

    var linker = function (scope, element, attrs) {

      var loader = getTemplate(attrs.eventid);

      var promise = loader.success(function (html) {
        element.html(html);
      }).then(function (response) {
        element.replaceWith($compile(element.html())(scope));
      });
    };

    return {
      restrict: 'E',
      scope: {
        eventID: '='
      },
      link: linker
    };
  }
})();
