'use strict';

angular.module('dashboard', []);
angular.module('users', []);

//Routers
myApp.config(function($stateProvider) {
  $stateProvider.state('dashboard', {
	url: '/dashboard',
    templateUrl: 'partials/dashboard/dashboard.html',
	data:{
		auth:true
	}
  });

});

//Factories
myApp.factory('dashboardServices', ['$http', function($http) {

    var factoryDefinitions = {
      getTodaysStats: function($scope) {
        return $http.post('http://www.chivuolessersarabanda.com/calendario/TurnoOggi.ashx?LOGIN=' + $scope.userInfo.data.email).success(function(data) { return data; });
      },
	  getRecentNews: function($scope) {
        return $http.get('http://www.chivuolessersarabanda.com/calendario/ProssimeVariazioni.ashx?LOGIN=' + $scope.userInfo.data.email).success(function(data, status, headers, config) { return data; });
      },
	  getLastFiveCustomers: function() {
        return $http.get('partials/dashboard/mock/customers_last_five.json').success(function(data) { return data; });
      }
	}

    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('todaysStatsController', ['$scope', 'dashboardServices', function($scope, dashboardServices) {
	dashboardServices.getTodaysStats($scope).then(function(result){
		$scope.data = result.data;
	});
}]);

myApp.controller('recentNewsController', ['$scope', 'dashboardServices', function($scope, dashboardServices) {
	dashboardServices.getRecentNews($scope).then(function(result){
		$scope.data = result.data;
	});
}]);

myApp.controller('getLastFiveCustomersController', ['$scope', 'dashboardServices', function($scope, dashboardServices) {
	dashboardServices.getLastFiveCustomers().then(function(result){
		$scope.data = result.data;
	});
}]);
