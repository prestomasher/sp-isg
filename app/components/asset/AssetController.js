/**
 * Controller for Assets on map
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp').
		controller('AssetController', [

			'$scope', '$interval', 'appModel', 'GMapService', '$rootScope', 'assetModel', 'assetFilters', 'D3GoogleMap',
			function($scope, $interval, appModel, GMapService, $rootScope, assetModel, assetFilters, D3GoogleMap) {
			// public
			// - - - - - - - - - - - - - - - - - - - - - - -
				$scope.labels = appModel.dictionary;
				$scope.filterTemplate = 'app/shared/views/nofilter.html';
				// real time alerts selected city
				$scope.rtAlertsSelectedCity = '';
				
				// $scope.alertsPagination = {
	   //              totalItems: 0,
	   //              currentPage: 1,
	   //              itemsPerPage: 6
	   //          };

	            $scope.alertsDetailsPagination = {
	                totalItems: 0,
	                currentPage: 1,
	                itemsPerPage: 3
	            };

				$scope.alerts = {
					alertsArray : [],
					alertsDetailsArray : [{ email_datetime: $scope.labels.noData }] 
				};

				assetModel.getMarkersData().
					then(
						function( markersData ) {
							var markersDataArray = ( angular.isArray( markersData.records.record ) ) ?  markersData.records.record : [ markersData.records.record ];
							// Draw empty map
							// GMapService.drawMap( markersDataArray );
							D3GoogleMap.drawMap({
								container : '#map-canvas',
								data      : markersDataArray 
							});
							// set to scope
							$scope.alerts.alertsArray = markersDataArray;
							// set total items for pagination
							$scope.alertsPagination.totalItems = $scope.alerts.alertsArray.length;

							getPieChart();
							// $interval(function() {
							// 	$scope.addCity({});
							// }, 3000);
						},
					
						function(error) {
							if( error.status === 401 || error.status === 404 ) {
								$location.path('/login');
							}
						}
					);

				/**
				 * called by the layout template
				 * @param  {JSON} alert alert object
				 * @return {Array/JSON}       can return array or single JSON with alerts data
				 */
				$scope.getAlertsDetail = function( alert ) {
					assetModel.getAlertsDetail( alert.city ).
						then(
							function( alertsDetails ) {
								var alertsDetailsArray = ( angular.isArray( alertsDetails.records.record ) ) ? alertsDetails.records.record : [ alertsDetails.records.record ];								
								// set to scope
								$scope.alerts.alertsDetailsArray = alertsDetailsArray;
								// set total items for pagination
								$scope.alertsDetailsPagination.totalItems = $scope.alerts.alertsDetailsArray.length;
								// $scope.rtAlertsSelectedCity = city;

								updateChart( alert, alertsDetailsArray );
							},
						
							function(error) {
								if( error.status === 401 || error.status === 404 ) {
									$location.path('/login');
								}
							}
						);
				};

				$scope.addCity = function( alert ) {
					var data = {"Severity":"Alert","AlertCount":18,"Latitude":"50.111606","Longitude":"8.680795","city":"Frankfurt","$$hashKey":"0JZ"};
					D3GoogleMap.addMarker( data );
				};

			// private
			// - - - - - - - - - - - - - - - - - - - - - - -
				/**
				 * returns pie chart
				 * @param  {Array} Array of JSON objects
				 */				
				var pieChart = null,
					alertsDetailsArray = null;

				// creates empty pie chart
				function getPieChart() {
					pieChart = c3.generate({
						bindto: '#rtAlertsChartContainer',
						padding: { top: 40, right: 50, bottom: 10, left: 50, },
					    data: {					       
					        columns: [],
					        type : 'pie',
					        colors: {
					        	normal  : '#aae200', // success
					        	warning : '#e6d549', // warning
					        	alert   : '#e22020'	// alert
					        },
					        empty: {
								label: {
									text: $scope.labels.clickForData
								}
							},
					        onclick: function (d, i) { console.log("onclick", d.name, alertsDetailsArray); }
					    },
					    legend: {
					        show: false
					    },
					    pie: {
					        label: {
					            format: function (value, ratio, id) {
					            	return value;
					            }
					        }
					    }
					});	
				}

				// update chart with alerts from clicked city
				function updateChart( alert, dataArray ) {					
					pieChart.load({
					  columns: [
					    ['normal', alert.value.normal],
					    ['warning', alert.value.warning],
					    ['alert', alert.value.alert],
					  ],
					  unload: ['normal', 'warning', 'alert']
					});

					alertsDetailsArray = dataArray;
				}

				// listeners
				// - - - - - - - - - - - - - - - - - - -
				// Map was clicked
				$scope.$on( 'mapMarkerClicked', function(event, dataItem) {
					$scope.getAlertsDetail( dataItem );
				});

				// cleanup before exiting page
	            //- - - - - - - - - - - - - - - - - - - - - 
	            $scope.$on("$locationChangeStart", function(event) {
	                
	            });
			}
		]);					
})(angular);