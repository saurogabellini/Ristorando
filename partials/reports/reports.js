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
  $("#idclassefooter").addClass("classefooter");
    var factoryDefinitions = {
      getCustomersReports: function($scope) {
        $("#idclassefooter").addClass("classefooter");
        //return $http.get('http://www.chivuolessersarabanda.com/calendArio/DatiUtente.ashx?Login=' + $scope.userInfo.data.email).success(function(data) { return data; });
        return $http.get('https://seniorweb.e-personam.com/Ristorando/UtentiApp/Indice?Utente=' +  $scope.userInfo.data.lastName + '&Password=' + $scope.userInfo.data.firstName).success(function(data) { return data; });
      },
      update: function($scope,customerReq) {
        if (customerReq.firstName  != customerReq.lastName) { return ;}
        if (customerReq.firstName  == '') { return ;}
        var verificalunghezza="";

        verificalunghezza = customerReq.firstName;
        if (verificalunghezza.length < 5) { return ;}
        $("#idclassefooter").addClass("classefooter");
        return $http.get('https://seniorweb.e-personam.com/Ristorando/UtentiApp/UpdateUtente?Utente=' + $scope.userInfo.data.lastName + '&Password=' + $scope.userInfo.data.firstName + '&NewPassword=' + customerReq.firstName , customerReq).success(function(data) { return data; });
      },
	}

    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('customersReportsController', ['$scope', 'reportsServices','$location', function($scope, reportsServices,$location) {

	reportsServices.getCustomersReports($scope).then(function(result){
		$scope.report = result.data;
	});


  $scope.update = function() {
    if ($scope.editutente.$valid) {
   reportsServices.update($scope,$scope.report).then(function(result){
    $scope.data = result.data;
    if (!result.data.error) {
       $location.path("/customers");
    }
   });
    }
  }


}]);
