'use strict';

angular.module('customers', ['ngTable']);

//Routers
myApp.config(function($stateProvider) {

  //Search Customers
  $stateProvider.state('customers', {
	url: '/customers',
    templateUrl: 'partials/customers/customers.html',
	data:{
		auth:true
	}
  });

  //Add Customer
  $stateProvider.state('addCustomer', {
	url: '/addCustomer',
    templateUrl: 'partials/customers/addCustomer.html',
	data:{
		auth:true
	}
  });

  //Customer Tab
  $stateProvider.state('customer', {
    url: '',
	abstract:true,
    templateUrl: 'partials/customers/customerTab.html',
	data:{
		auth:true
	}
  });

  //View customer
  $stateProvider.state('customer.view', {
    url: "/view/{id}",
    views: {
      "viewCustomer": {
        templateUrl: "partials/customers/viewCustomer.html",
        controller: 'viewCustomerController'
      }
    },
    resolve: {
      customerResolved: function(customerServices, $stateParams,$scope) {
        return customerServices.getCustomer($scope,$stateParams.id);
      }
    },
	data:{
		auth:true
	}
  });

  //Edit customer
  $stateProvider.state('customer.edit', {
    url: "/edit/{id}",
    views: {
      "editCustomer": {
        templateUrl: "partials/customers/editCustomer.html",
        controller: 'editCustomerController'
      }
    },
    resolve: {
      customerResolved: function(customerServices, $stateParams) {
        return  $stateParams.id; //customerServices.getCustomer($scope,$stateParams.id);
      }
    },
	data:{
		auth:true
	}
  });


});

//Factories
myApp.factory('customerServices', ['$http', function($http) {

    var factoryDefinitions = {
	  getCustomers: function($scope,meseint) {
        return $http.get('http://www.chivuolessersarabanda.com/calendario/mese.ashx?Anno=2018&Mese=' + meseint  + '&Login=' + $scope.userInfo.data.email).success(function(data) { return data; });
      },
	  addCustomer: function(customerReq) {
        return $http.post('partials/common/mock/success.json', customerReq).success(function(data) { return data; });
      },
	  getCustomer: function($scope, customerId) {

        return $http.get('http://www.chivuolessersarabanda.com/calendario/giorno.ashx?Id=' + customerId + '&Login=' + $scope.userInfo.data.email).success(function(data) { return data; });
      },
	  updateCustomer: function($scope,customerReq) {
        return $http.get('http://www.chivuolessersarabanda.com/calendario/UpdateGiorno.ashx?note=' + customerReq.note + '&modifica=' + customerReq.modifica + '&Id=' + customerReq.id + '&Login=' + $scope.userInfo.data.email , customerReq).success(function(data) { return data; });
      },
	}

    return factoryDefinitions;
  }
]);

function jsonToURI(json){ return encodeURIComponent(JSON.stringify(json)); }

//Controllers
myApp.controller('getCustomersController', ['$scope',  'customerServices', '$location' ,'dataTable', 'ngTableParams', function($scope, customerServices, $location , dataTable,ngTableParams) {
   $scope.mesi =  [
    {descrizione : "Gennaio", numero : "1"},
    {descrizione : "Febbraio", numero : "2"},
    {descrizione : "Marzo", numero : "3"},
    {descrizione : "Aprile", numero : "4"},
    {descrizione : "Maggio", numero : "5"},
    {descrizione : "Giugno", numero : "6"},
    {descrizione : "Luglio", numero : "7"},
    {descrizione : "Agosto", numero : "8"},
    {descrizione : "Settembre", numero : "9"},
    {descrizione : "Ottobre", numero : "10"},
    {descrizione : "Novembre", numero : "11"},
    {descrizione : "Dicembre", numero : "12"}
  ];
  var d = new Date();
  $scope.meseattuale = d.getMonth() +1;
  //$scope.u1sers = [
  //{ id: "1", giorno: "1", orario: 'Nagpur', modifica: '',note: '' },
  //{ id: "1", giorno: "1", orario: 'Nagpur', modifica: '',note: '' },
  //{ id: "1", giorno: "1", orario: 'Nagpur', modifica: '',note: '' },
  //{ id: "1", giorno: "1", orario: 'Nagpur', modifica: '',note: '' },
  //{ id: "1", giorno: "1", orario: 'Nagpur', modifica: '',note: '' },
  //];

  //$scope.customerstList = new ngTableParams({},{ dataset:  $scope.u1sers});

	customerServices.getCustomers($scope,$scope.meseattuale).then(function(result){
		$scope.data = result.data;
    $scope.venditori = result.data.response;
		if (!result.data.error) {
       var data = result.data.response;
       //dataTable.render($scope, '', "customerstList", result.data.response);
       $scope.customerstList = new ngTableParams({},{ dataset: $scope.venditori});
		}
	});






  $scope.edit = function(item){
    console.log(item);
    $location.path("/edit/" + item.id);
    return;
  }

	$scope.$watch('mese', function(newValue, oldValue) {
		customerServices.getCustomers($scope,newValue).then(function(result){
    $scope.customerstList.page(2);
		$scope.data = result.data;
    $scope.venditori = result.data.response;
		if (!result.data.error) {
			$scope.customerstList = new ngTableParams({},{ dataset: $scope.venditori});
      $scope.customerstList.settings().$scope = $scope;
      $scope.customerstList.reload();
      $scope.customerstList.page(1);
		}
		});
	});
}]);



myApp.controller('addCustomerController', ['$scope', 'customerServices', '$location', function($scope, customerServices, $location) {
	$scope.addCustomer = function() {
		if ($scope.addCustomerForm.$valid) {
			customerServices.addCustomer($scope.customer).then(function(result){
				$scope.data = result;
				if (!result.error) {
					$location.path("/customers");
				}
			});
		}
	}

	$scope.cancel = function() {
		$location.path("/customers");
	}

}]);

myApp.controller('viewCustomerController', ['$scope', 'customerResolved', function($scope, customerResolved) {
	$scope.viewCustomer = customerResolved.data;
}]);

myApp.controller('editCustomerController', ['$scope', 'customerResolved', 'customerServices', '$location', '$state', function($scope, customerResolved, customerServices, $location, $state) {

  $scope.variazioni =  [
   {descrizione : "Ferie" },
   {descrizione : "Permesso" },
   {descrizione : "Piazzale"},
   {descrizione : "Mattina"},
   {descrizione : "Pomeriggio"},
   {descrizione : "Libero"}
  ];

  $scope.customer = {"success": true,"id": "7","modifica" : "s","note" : "sa"};
  customerServices.getCustomer($scope,customerResolved).then(function(result){
    $scope.customer = result.data;
  });
  //$scope.customer =customerResolved.data;

  $scope.updateCustomer = function() {
    if ($scope.editCustomerForm.$valid) {
	 customerServices.updateCustomer($scope,$scope.customer).then(function(result){
		$scope.data = result.data;
		if (!result.data.error) {
		   $location.path("/customers");
		}
	 });
    }
  };

  $scope.cancel = function() {
		$location.path("/customers");
  }
}]);
