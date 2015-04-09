/**
 * Datamodel that contains shared values for the application
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp').

		service('appModel', [

			'PrestoServices',			
			function(PrestoServices){
			
				var dictionary = {
					logout       : 'Logout',
					alerts       : 'real-time alerts',
					alertsDetail : 'alerts details',
					realTime     : 'real time',
					ok           : 'ok',
					noData       : 'data not available',
					clickForData : 'select city from map',

					//Filters
					filters      : 'options',
					noOptions    : 'No options Available',
					customer     : 'customer',
					campus       : 'campus',
					building     : 'building',
					floor        : 'floor',
					serial       : 'serial number',
					go           : 'GO',
					allCustomers : 'All Customers',
					allCampuses  : 'All Campuses',
					allBuildings : 'All Buildings',

					//Legend
					legNormal    : 'NORMAL',
					legRecovery  : 'WARNING',
					legAlert     : 'ALERT'
				};

				// Gets user details from Presto
				var getUser = function() {
					return PrestoServices.getREST('/presto/edge/api/rest/addUsersDetailstoSession/Invoke?x-presto-resultFormat=json&callback=JSON_CALLBACK');
				};

				return {
					dictionary: dictionary,
					getUserSession: getUser
				};
		}]);
		
})(angular);