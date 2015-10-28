(function () {
  'use strict';

  angular
    .module('main')
    .controller('Competitions', Competitions);

  Competitions.$inject = [
    '$mdSidenav',
    '$filter',
    '$state',
    'moment',
    'AuthenticationService',
    'CompetitionService',
    'SoccerMatchService',
    'TeamService',
    '$ionicLoading'
  ];

  function Competitions(
    $mdSidenav,
    $filter,
    $state,
    moment,
    AuthenticationService,
    CompetitionService,
    SoccerMatchService,
    TeamService,
    $ionicLoading) {
    console.log('Controller [Competitions] started:', this);

    var vm = this;
    vm.title = 'Competities';
    vm.loadCompetitionMatches = loadCompetitionMatches;
    vm.loadCompetitionStats = loadCompetitionStats;
    vm.calculateCompetitionRanking = calculateCompetitionRanking;
    vm.filterSelectedTeam = filterSelectedTeam;
    vm.castKeyToDate = castKeyToDate;
    vm.getTeamLogoPath = TeamService.getTeamLogoPath;
    vm.resultGroupFilter = resultGroupFilter;
    vm.showSoccerMatchDetails = showSoccerMatchDetails;
    vm.scheduleGroupFilter = scheduleGroupFilter;

    // TODO: Refactor as soon as possible
    vm.changeSelectedCompetition = changeSelectedCompetition;

    activate();
    ////////////////////////////////

    function activate() {
      vm.ready = false;
      if (!vm.selectedTeam) {
        vm.selectedTeam = AuthenticationService.getDefaultTeam();
      }

      if (!vm.selectedCompetitionID) {
        vm.selectedCompetitionID = AuthenticationService.getDefaultCompetitionID();
      }
      loadCompetitionMatches();
      loadCompetitionStats();
      vm.ready = true;
    }

    function loadCompetitionMatches() {
      SoccerMatchService.getSoccerMatchesByCompetition(vm.selectedCompetitionID)
        .then(function (response) {
          vm.soccerMatches = response.data.SoccerMatches;
          var totalMatches = vm.soccerMatches.length;
          for (var i = 0; i < totalMatches; i++) {
            var sm = vm.soccerMatches[i];
            if (sm.FallbackDateTime) {
              sm.PlayDate = moment(sm.FallbackDateTime);
              sm.PlayTime = moment(sm.FallbackDateTime).format('hh:mm');
            } else {
              sm.PlayDate = sm.MatchDate;
              sm.PlayTime = sm.DefaultStartTime;
            }
            if (sm.HomeTeamID === vm.selectedTeam.TeamID || sm.AwayTeamID === vm.selectedTeam.TeamID) {
              sm.ResultIndicator = determineResult(sm);
              vm.soccerMatches[i] = sm;
            }
          }
          vm.soccerMatchesGrouped = $filter('toArray')($filter('groupBy')(vm.soccerMatches, 'PlayDate'), true);
          vm.calculateCompetitionRanking();
        });
    }

    function determineResult(sm) {
      var teamGoals = null;
      var oponentGoals = null;
      if (sm.HomeTeamID === vm.selectedTeam.TeamID) {
        teamGoals = sm.HomeGoals;
        oponentGoals = sm.AwayGoals;
      } else {
        teamGoals = sm.AwayGoals;
        oponentGoals = sm.HomeGoals;
      }

      if (teamGoals > oponentGoals) {
        return 'W';
      } else if (teamGoals === oponentGoals) {
        return 'G';
      } else {
        return 'V';
      }
    }

    function resultGroupFilter(group) {
      return group.some(function (sm) {
        return sm.SoccerMatchStatusID === 'PLD';
      });
    }

    function scheduleGroupFilter(group) {
      return group.some(function (sm) {
        return sm.SoccerMatchStatusID !== 'PLD';
      });
    }

    function loadCompetitionStats() {
      CompetitionService.getCompetitionStatsForTeam(vm.selectedCompetitionID, vm.selectedTeam.TeamID)
        .then(function (response) {
          vm.competitionStats = response.data.CompetitionStats;
          //vm.$broadcast('scroll.refreshComplete');
        });
    }

    function filterSelectedTeam(match) {
      return ((match.HomeTeamID === vm.selectedTeam.TeamID || match.AwayTeamID === vm.selectedTeam.TeamID));
    }

    function castKeyToDate(arr) {
      // Cast the group key to a Date.
      // arr.$key = new Date(arr.$key);
      return new Date(arr.$key);
    }

    function changeSelectedCompetition(competitionID) {
      vm.selectedCompetitionID = competitionID;
      activate();
    }

    function showSoccerMatchDetails(soccerMatchID) {
      $state.transitionTo('main.soccer-match', {
        soccerMatchID: soccerMatchID
      });
    }

    function calculateCompetitionRanking() {
      var resultList = [];
      vm.soccerMatches.map(function (match) {
        if (match.HomeGoals != null && match.AwayGoals != null) {
          var h = {
            'TeamID': match.HomeTeamID,
            'TeamName': match.HomeTeamName,
            'Scored': match.HomeGoals,
            'Conceded': match.AwayGoals
          };
          resultList.push(h);
          var a = {
            'TeamID': match.AwayTeamID,
            'TeamName': match.AwayTeamName,
            'Scored': match.AwayGoals,
            'Conceded': match.HomeGoals
          };
          resultList.push(a);
        }
      });

      var teamResults = $filter('groupBy')(resultList, 'TeamID');
      vm.ranking = [];
      Object.keys(teamResults).forEach(function (key, index) {

        var played = 0,
          wins = 0,
          draws = 0,
          loses = 0,
          scored = 0,
          conceded = 0;

        var teamName = teamResults[key][0].TeamName;

        teamResults[key].forEach(function (x) {
          played++;
          scored += x.Scored;
          conceded += x.Conceded;
          if (x.Scored > x.Conceded) {
            wins++;
          } else if (x.Scored < x.Conceded) {
            loses++;
          } else {
            draws++;
          }
        });

        var rank = [];
        rank.Teamid = key;
        rank.TeamName = teamName;
        rank.Played = played;
        rank.Wins = wins;
        rank.Draws = draws;
        rank.Loses = loses;
        rank.Points = (wins * 3) + (draws * 1);
        rank.Scored = scored;
        rank.Conceded = conceded;
        rank.Diff = scored - conceded;

        vm.ranking.push(rank);
      });
    }
  }
})();
