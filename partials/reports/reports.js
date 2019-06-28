'use strict';

angular.module('reports', ['chart.js']);

//Routers
myApp.config(function($stateProvider) {
  $stateProvider.state('reports', {
	url: '/reports',
    templateUrl: 'partials/reports/reports.html',
	data:{
		auth:true
	}
  });

});

//Factories
myApp.factory('reportsServices', ['$http', function($http) {

    var factoryDefinitions = {
      getCustomersReports: function($scope) {
        return $http.get('http://www.chivuolessersarabanda.com/calendArio/DatiUtente.ashx?Login=' + $scope.userInfo.data.email).success(function(data) { return data; });
      },
      update: function($scope,customerReq) {
          return $http.get('http://www.chivuolessersarabanda.com/calendario/UpdateUtente.ashx?NOME=' + customerReq.NOME + '&COGNOME=' + customerReq.COGNOME + '&INIZIOTURNO=' + customerReq.INIZIOTURNO + '&Login=' + $scope.userInfo.data.email , customerReq).success(function(data) { return data; });
        },
	}

    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('customersReportsController', ['$scope', 'reportsServices','$location', function($scope, reportsServices,$location) {
  $scope.TURNI =  [
   {descrizione : "1° Mattina", valore : "1"},
   {descrizione : "2° Mattina", valore : "2"},
   {descrizione : "1° Pomeriggio", valore : "3"},
   {descrizione : "2° Pomeriggio", valore : "4"},
   {descrizione : "1° Libero", valore : "5"},
   {descrizione : "2° Pomeriggio", valore : "6"}
 ];

	reportsServices.getCustomersReports($scope).then(function(result){
		$scope.report = result.data;
	});


  $scope.update = function() {
    if ($scope.editutente.$valid) {
   reportsServices.update($scope,$scope.report).then(function(result){
    $scope.data = result.data;
    if (!result.data.error) {
       $location.path("/dashboard");
    }
   });
    }
  }


}]);
