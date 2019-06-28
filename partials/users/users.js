'use strict';
angular.module('users', []);

//Routers
myApp.config(function($stateProvider) {

  //Login
  $stateProvider.state('login', {
	url: "/login",
    templateUrl: 'partials/users/login.html',
	controller: 'loginController'
  });

  //Signup
  $stateProvider.state('signup', {
	url: "/signup",
    templateUrl: 'partials/users/signup.html',
	controller: 'signupController'
  });

  //Logout
  $stateProvider.state('logout', {
	url: "/logout",
	template: "<h3>Logging out...</h3>",
    controller: 'logoutController'
  });

});

//Factories
myApp.factory('userServices', ['$http', function($http) {

    var factoryDefinitions = {
      login: function(loginReq) {
        $("#idclassefooter").addClass("classefooter");
        //loginReq
        return $http.post('https://seniorweb.e-personam.com/Ristorando/UtentiApp/Indice?Utente=' + loginReq.email + '&Password=' + loginReq.password).success(function(data) { return data; });
      },
	  signup: function(signupReq) {
        return $http.post('partials/common/mock/success.json', signupReq).success(function(data) { return data; });
      }
	}

    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('loginController', ['$scope', 'userServices', '$location', '$rootScope', function($scope, userServices, $location, $rootScope) {

	$scope.login = {"email":"mail", "password": "mypassword"};

  if (localStorage.getItem('mail')!=null) {
     $scope.login.email=localStorage.getItem('mail');
     $scope.login.password=localStorage.getItem('password');
     userServices.login($scope.login).then(function(result){
       $scope.data = result;
       if (result.data.success) {
         window.sessionStorage["userInfo"] = JSON.stringify(result.data);
         $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
           $location.path("/customers");
       }
     });
  }

	$scope.doLogin = function() {

		if ($scope.loginForm.$valid) {
      localStorage.setItem('mail', $scope.login.email);
      localStorage.setItem('password', $scope.login.password);
			userServices.login($scope.login).then(function(result){
				$scope.data = result;
				if (result.data.success) {
				  window.sessionStorage["userInfo"] = JSON.stringify(result.data);
				  $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
  				  $location.path("/customers");
				}
			});
		}
	};
}]);

myApp.controller('signupController', ['$scope', 'userServices', '$location', function($scope, userServices, $location) {
	$scope.doSignup = function() {
		if ($scope.signupForm.$valid) {
			userServices.signup($scope.signup).then(function(result){
				$scope.data = result;
				if (!result.error) {
					$location.path("/login");
				}
			});
		}
	}
}]);

myApp.controller('logoutController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
	sessionStorage.clear();
  localStorage.setItem('mail', '');
  localStorage.setItem('password', '');
	$rootScope.userInfo = false;
	$location.path("/login");
}]);
