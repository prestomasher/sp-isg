/**
 * Filter functionality for assets
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp').

		service('assetFilters', [

			'assetModel', '$location',
			function(assetModel, $location) {

				// Filters buildings by company
				var filterByCompany = function(name) {
					var customerArray = assetModel.markers;

					var filter = (name !== null) ? name.customerName : null;
					assetModel.customerFiltered = [];

					for (var customer = 0, len = customerArray.length; customer < len; ++customer) {
						var customerItem = customerArray[customer];
					
						var matchingMarker = customerItem.customer === filter || filter === null;

						if(matchingMarker) {							
							assetModel.customerFiltered.push(customerItem);
						}
						customerItem.setVisible(matchingMarker);
					}
				};

				// Filters campuses by building
				var filterByCampus = function(campus) {
					var campusArray = assetModel.customerFiltered;

					var filter = (campus !== null) ? campus.campusName : null;
						assetModel.campusFiltered = [];

					for (var campus = 0, len = campusArray.length; campus < len; ++campus) {
						var campusItem = campusArray[campus];
					
						var matchingMarker = campusItem.campus === filter  || filter === null;

						if(matchingMarker) {
							assetModel.campusFiltered.push(campusItem);
						}
						campusItem.setVisible(matchingMarker);
					}
				};

				// Filter by buildings
				var filterByBuilding = function(building) {
					var buildingsArray = assetModel.campusFiltered;
			
					var filter = (building !== null) ? building.buildingName : null;

					for (var building = 0, len = buildingsArray.length; building < len; ++building) {
						var buildingItem = buildingsArray[building];
					
						var matchingMarker = buildingItem.building === filter  || filter === null;
						buildingItem.setVisible(matchingMarker);
					}
				};

				var getDeviceBySerialNumber = function(serialNumber) {
					assetModel.getDeviceBySerialNumber(serialNumber).
						then(
							function( device ) {
								device = device.records.record;	
								var devicePath = "/floorplan/" + device.customerID + "/" + device.campusID + "/" + device.buildingID + "/" + device.floorID + "/" + device.serialNumber;

								$location.path(devicePath);
							},
						
							function(error) {
								if( error.status === 401 || error.status === 404 ) {
									$location.path('/login');
								}
							}
						);
				};

				return {
					filterByCompany: filterByCompany,
					filterByCampus: filterByCampus,
					filterByBuilding: filterByBuilding,
					getDeviceBySerialNumber: getDeviceBySerialNumber
				};
			}
		]);

		
})(angular);