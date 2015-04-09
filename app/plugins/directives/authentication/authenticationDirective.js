/**
 * Authentication module
 * This module contains an authentication controller
 * @dependencies 
 * 		'APP_CONFIG' constant. This is found on the App.Config module in appConfigService.js
 * 		'PrestoServices' service. This is found on the SAGPresto module in PrestoServices.js
 */
(function(ng) {
	angular.module('authentication', []).

		/**
		 * Creates login markup as a tag.
		 * To insert into page add this: <div data-login-form></div>
		 * @return {[type]} [description]
		 */
		directive('loginForm', function() {
			return {
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				replace: true,
				templateUrl: 'app/plugins/directives/authentication/login.html'
			};
		}).

		controller('LoginController', [
			'$scope',
			'$http',
			'$location',
			'APP_CONFIG',
			'PrestoServices',

			function($scope, $http, $location, APP_CONFIG, PrestoServices) {

				$scope.labels = {
					user: 'Username',
					pass: 'Password',
					button: 'Login',
					error: 'Login Error! Please verify credentials.',
					logout: $scope.$parent.labels.logout
				};
				
				// Login form fields
				$scope.loginForm = {
					user: "",
					pass: ""
				};

				// If login successful, where should the app go?
				$scope.successfulLoginPath = '/';

				// Hide login error message?
				$scope.error = true;

				// Method to authenticate to Presto
				$scope.login = function() {
					PrestoServices.getREST(
						'/presto/edge/api?inputStream={'+
							'"sid": "UserManagerService",'+
							'"oid": "login",'+
							'"svcVersion": "0.1",'+
							'"version": "1.1",'+
							'"params": ["'+
								$scope.loginForm.user +'","'+
								$scope.loginForm.pass +
							'"]'+
						'}&callback=JSON_CALLBACK'
					).
					then(
						function(auth) {
							if( auth.response.authToken ) {
								$location.path( $scope.successfulLoginPath );								
							} else {
								// Show error message
								$scope.error = false;
							}
						},

						function(error) {
							if(
								error.errorCode === '401'
							) {
								$location.path('/login');
							}
						}
					);
				};
		}]);

		
})(angular);

