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
       $("#idclassefooter").removeClass("classefooter");
        
        return $http.get('https://seniorweb.e-personam.com/Ristorando/EstrazioneConsegne/Indice?CodiceAssociazione=' + $scope.userInfo.data.email).success(function(data) { return data; });
      },
	  addCustomer: function(customerReq) {
        return $http.post('partials/common/mock/success.json', customerReq).success(function(data) { return data; });
      },
	  getCustomer: function($scope, customerId) {

      $("#idclassefooter").removeClass("classefooter");
        return $http.get('https://seniorweb.e-personam.com/Ristorando/EstrazioneConsegne/Consegna?CodiceOspite=' + customerId + '&CodiceAssociazione=' + $scope.userInfo.data.email).success(function(data) { return data; });
      },
	  updateCustomer: function($scope,customerReq) {
        var RicevutoUtente= customerReq.Utente;
        if (RicevutoUtente == null) { RicevutoUtente = 0;}

        var RicevutoDelegato1 = customerReq.CheckDelegato1;        
        if (RicevutoDelegato1 == null) { RicevutoDelegato1 = 0; }

        var RicevutoDelegato2 = customerReq.CheckDelegato2;
        if (RicevutoDelegato2 == null) { RicevutoDelegato2 = 0; }

        if ((RicevutoDelegato2 == 1) && ( (customerReq.Delegato2 == '') || (customerReq.Delegato2 == null))) {          
          return;
        } 
        if ((RicevutoDelegato1 == 1) && ( (customerReq.Delegato1 == '') || (customerReq.Delegato1 == null))) {   
          return;
        } 

        customerReq.QRCODE=  $("#QRCODE").val();;
        if ((RicevutoUtente == 1) && ((customerReq.CodiceOspite != customerReq.QRCODE))) {
          return;
        }

        $("#idclassefooter").addClass("classefooter");
        return $http.get('https://seniorweb.e-personam.com/Ristorando/EstrazioneConsegne/UpDateConsegna?CodiceOspite=' + customerReq.CodiceOspite + '&Note=' + customerReq.Note +
            '&RicevutoUtente=' + RicevutoUtente + '&RicevutoDelegato1=' + RicevutoDelegato1 + '&RicevutoDelegato2=' + RicevutoDelegato2 + '&Utente=' + $scope.userInfo.data.lastName, customerReq).success(function(data)  { return data; });
      },
	}

    return factoryDefinitions;
  }
]);

function jsonToURI(json){ return encodeURIComponent(JSON.stringify(json)); }

//Controllers
myApp.controller('getCustomersController', ['$scope',  'customerServices', '$location' ,'dataTable', 'ngTableParams', function($scope, customerServices, $location , dataTable,ngTableParams) {

	customerServices.getCustomers($scope,$scope.meseattuale).then(function(result){
		$scope.data = result.data;
    $scope.venditori = result.data;
		if (!result.data.error) {
       var data = result.data;
       //dataTable.render($scope, '', "customerstList", result.data.response);
       //$scope.customerstList = new ngTableParams({ count: $scope.venditori.length},{ counts: [], dataset: $scope.venditori});

       $scope.customerstList = new ngTableParams({ count: $scope.venditori.length},{ counts: [], dataset: $scope.venditori});
		}
	});

  $scope.leggiqrcode = function() {
		$location.path("/customers");
  }



  $scope.calculateTotal = function(){
      var total = 0;
      $scope.venditori.forEach(function(item){
          total += item.scontrino;
      });
      return Math.round(total * 100) / 100 ;
  };


  $scope.edit = function(item){
    if ((item.Orario== null) || (item.Orario== '')) {
       $location.path("/edit/" + item.id);
    }
    return;
  }


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

  $scope.leggiqrcode = function() {

    cordova.plugins.barcodeScanner.scan(
         function () {
            alert(result.text);
          $("#QRCODE").val(result.text);
          alert(r$("#QRCODE").val());
       }, 
       function (error) {
         alert("Errore nella scansione " + error);
      }
   );
    
  }


  $scope.cancel = function() {
		$location.path("/customers");
  }
}]);
