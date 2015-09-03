'use strict';
angular.module('main', [
    'ionic',
    'ngCordova',
    'ui.router',
    'ngMaterial',
    'angular.filter',
    'angular-jwt',
    'angular-storage'
    // TODO: load other modules selected during generation
  ])
  .run(runBlock)

.config(function ($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('teal')
    .accentPalette('orange');
})

.config(function ($httpProvider, jwtInterceptorProvider, REGEX_PATTERNS) {
  jwtInterceptorProvider.tokenGetter = ['aiStorage', '$http', function (aiStorage, $http) {
    var token = aiStorage.get('jwt');
    return token;
  }];

  $httpProvider.interceptors.push('jwtInterceptor');

  $httpProvider.interceptors.push(function () {
    function convertDateStringsToDates(input) {
      // Ignore things that aren't objects.
      if (typeof input !== 'object') {
        return input;
      }

      for (var key in input) {
        if (!input.hasOwnProperty(key)) {
          continue;
        }

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === 'string' && (match = value.match(REGEX_PATTERNS.DateRegex))) {
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === 'object') {
          // Recurse into object
          convertDateStringsToDates(value);
        }
      }
    }
    return {
      response: function (response) {
        convertDateStringsToDates(response.data);

        return response;
      }
    };
  });
})

.config(function ($stateProvider, $urlRouterProvider) {

  console.log('Allo! Allo from your module: ' + 'main');

  // ROUTING with ui.router
  $stateProvider
  // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      url: '/main',
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      controller: 'Navigation as vmNav',
    })
    .state('main.home', {
      url: '/home',
      views: {
        'contentView': {
          templateUrl: 'main/templates/home.html',
          controller: 'Home as vm'
        }
      }
    })
    .state('main.login', {
      url: '/login',
      views: {
        'contentView': {
          templateUrl: 'main/templates/login.html',
          controller: 'Login as vm'
        }
      }
    })
    .state('main.competitions', {
      url: '/competition',
      views: {
        'contentView': {
          templateUrl: 'main/templates/competition/competition.html',
          controller: 'Competitions as vm'
        }
      }
    })
    .state('main.competitions.content', {
      views: {
        'stats': {
          templateUrl: 'main/templates/competition/competition-stats.html',
        },
        'results': {
          templateUrl: 'main/templates/competition/competition-results.html',
        },
        'schedule': {
          templateUrl: 'main/templates/competition/competition-schedule.html',
        },
        'ranking': {
          templateUrl: 'main/templates/competition/competition-ranking.html',
        }
      }
    })
    .state('main.trainings', {
      url: '/trainings',
      views: {
        'contentView': {
          templateUrl: 'main/templates/trainings.html',
          controller: 'Trainings as vm'
        }
      }
    })
    .state('main.trainings-manager', {
      url: '/trainings-manager',
      views: {
        'contentView': {
          templateUrl: 'main/templates/trainings-manager.html',
          controller: 'TrainingsManager as vm'
        }
      }
    })
    .state('main.training-manager', {
      url: '/training-manager/:trainingID',
      views: {
        'contentView': {
          templateUrl: 'main/templates/training-manager.html',
          controller: 'TrainingManager as vm'
        }
      }
    })
    .state('main.training', {
      url: '/training/:trainingID?teamID',
      views: {
        'contentView': {
          templateUrl: 'main/templates/training.html',
          controller: 'Training as vm'
        }
      }
    })
    .state('main.competition-manager', {
      url: '/competition-manager',
      views: {
        'contentView': {
          templateUrl: 'main/templates/competition-manager.html',
          controller: 'CompetitionManager as vm'
        }
      }
    })
    .state('main.competition-round-manager', {
      url: '/competition-round-manager/:id',
      views: {
        'contentView': {
          templateUrl: 'main/templates/competition-round-manager.html',
          controller: 'CompetitionRoundManager as vm'
        }
      }
    })
    .state('main.soccer-match-manager', {
      url: '/soccer-match-manager/:id',
      views: {
        'contentView': {
          templateUrl: 'main/templates/soccer-match-manager.html',
          controller: 'SoccerMatchManager as vm'
        }
      }
    })
    .state('main.soccer-match-manager.lineup', {
      templateUrl: 'main/templates/soccer-match-lineup-manager.html',
      controller: 'SoccerMatchLineupManager as vm'
    })
    .state('main.soccer-match', {
      url: '/soccer-match/:soccerMatchID',
      views: {
        'contentView': {
          templateUrl: 'main/templates/soccer-match.html',
          controller: 'SoccerMatch as vm'
        }
      }
    })
    .state('main.team-manager', {
      url: '/team-manager',
      views: {
        'contentView': {
          templateUrl: 'main/templates/team-manager.html',
          controller: 'TeamManager as vm'
        }
      }
    })
    .state('main.players-manager', {
      url: '/players-manager',
      views: {
        'contentView': {
          templateUrl: 'main/templates/players-manager.html',
          controller: 'PlayersManager as vm'
        }
      }
    })
    .state('main.season', {
      url: '/season',
      views: {
        'contentView': {
          templateUrl: 'main/templates/season.html',
          controller: 'Season as vm'
        }
      }
    });

  $urlRouterProvider.otherwise('/main/home');
});

function runBlock(moment) {
  moment.locale('nl');
}
