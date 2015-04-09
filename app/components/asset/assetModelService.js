/**
 * This data model will centralize data for AssetController and GoogleMapService
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp').

		service('assetModel', [

			'PrestoServices', '$rootScope',

			function(PrestoServices, $rootScope) {
				var assets = {
					customersArray: []
				};

				var map = null;
				var markersArray = [];
				var customerFiltered = [];
				var campusFiltered = [];

				var getMarkersData = function() {
					return PrestoServices.getREST('/presto/edge/api/rest/RAD_Varonis_Map/Invoke?x-presto-resultFormat=json&callback=JSON_CALLBACK');
				};

				var getAlertsDetail = function( city ) {
					return PrestoServices.getREST('/presto/edge/api/rest/RAD_VARONIS_UI_1/Invoke?x-presto-resultFormat=json&callback=JSON_CALLBACK');
				};

				return {
					map: map,
					markers: markersArray,
					getMarkersData: getMarkersData,
					getAlertsDetail: getAlertsDetail					
				};
			}

		]);

		
})(angular);