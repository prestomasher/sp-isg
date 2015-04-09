/**
 * Main Entry point
 * @author Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp', [
		'ngRoute',
		'authentication',
		'angular-loading-bar',
		'ngAnimate',
		'angularUtils.directives.dirPagination',
		'mm.foundation'
		])
		.config(['$routeProvider',
			function($routeProvider) {
				$routeProvider
					.when('/login' , { templateUrl: 'app/components/login/login.html' })
					.when('/'      , { templateUrl: 'app/components/asset/layout.html' })
					.otherwise({ redirectTo: '/' });
		}]).

		// offset filter used by all pagination on this app.
		filter('offset', function() {

	        return function(input, start) {
	            start = parseInt(start, 10);
	             
	            return input.slice(start);
	        };

	    }).

		controller('LayoutController', [

			'$scope', 'APP_CONFIG', 'appModel', 'PrestoServices', '$location', 'SparklineChart', '$interval',
			function($scope, APP_CONFIG, appModel, PrestoServices, $location, SparklineChart, $interval) {
				
				//Config
				$scope.appTitle = APP_CONFIG.APP_TITLE;
				$scope.icons = APP_CONFIG.APP_ICONS;

				//Labels
				$scope.labels = appModel.dictionary;

				//scope
				$scope.JBUser = null;
				$scope.activeSession = false;
				$scope.filterTemplate = '';
				$scope.customersArray = appModel.customersArray;
				$scope.devMonitored = Math.floor(Math.random() * ( 200 - 170 + 1 ) + 170);				
				
				$scope.showAdmin = function() {
					$location.path('/administration');
				};

				$scope.logout = function() {
					PrestoServices.getREST(
						'/presto/edge/api?inputStream={'+
							'"sid": "UserManagerService",'+
							'"oid": "logout",'+
							'"svcVersion": "0.1",'+
							'"version": "1.1",'+
							'"params": []'+
						'}'+
						'&callback=JSON_CALLBACK'
					).
					then(
						function(data) {
							$scope.activeSession = false;
							$scope.JBUser = null;
							$location.path( '/login' );
						},

						function(error) {
							console.log("logout error", error);
						}
					);
				};

				// Check user login on load of app
				$scope.$on('$viewContentLoaded', function(){
					/**
					 * On load, check if user has session. If not, goes to login.
					 */					
					if($scope.JBUser === null) {
						
						$scope.showLoading = true;

						appModel.getUserSession().
							then(
								function(user) {
									$scope.JBUser = user.JBUser;
									$scope.activeSession = true;
									// $scope.showLoading = false;
									$scope.$broadcast('appStart');
								},

								function(error) {
									if( error.status === 401 || error.status === 404 ) {
										$scope.activeSession = false;
										$location.path('/login');
										// $scope.showLoading = false;
									}
								}
							);
					}
				});
		}]);
})(angular);