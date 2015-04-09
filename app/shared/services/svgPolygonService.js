/**
 * SVG Polygons service
 * Draws polygons from data
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp').

		service('svgPolygonService', [

			function(){
				// converts lat-lng to pixels
				//- - - - - - - - - - - - - - - - - - - - - -
				var convertX = function (x, imgWidth, imgID) {
					return (x / imgWidth * parseFloat($( imgID ).width()));
			    };
			    // converts lat-lng to pixels
				//- - - - - - - - - - - - - - - - - - - - - -
			    var convertY = function (y, imgHeight, imgID) {
			    	return (y / imgHeight * parseFloat($( imgID ).height()));
			    };

			    // empty svg container
			    // - - - - - - - - - - - - - - - - - - - - - -
			    var emptySvgContainer = function(geofenceContainer) {
			    	geofenceContainer.selectAll('*').remove();
			    };

			    /**
			     * draws polygon from data	
			     * @param  {JSON} config configuration parameters
			     * {
						geofenceContainer // Id of the element to be the geofence container
						geofencesArray    // Array of data for the geofences
						imgWidth          : width of the floormap
						imgHeight         : height of the floormap
						imgID             : id of the floormap image <img id="?">
						callback          : function to be called when polygon is clicked
					}
			     * @return {JSON}        returns an instance of the geofence container
			     */
				var drawPolygon = function( config ) {
					var geofenceContainer = null;

					// there should always be only one geofence container
                    if( $( config.geofenceContainer ).find("svg").length === 0 ) {
                        geofenceContainer = d3.select( config.geofenceContainer )
	                        .append('svg')
	                        .attr('width',  parseFloat($( config.imgID ).width()))
	                        .attr('height', parseFloat($( config.imgID ).height()))
	                        .attr('style', 'absolute')
	                        .style('position', 'absolute')
	                        .style('top', 0)
	                        .style('left', 0);
                    } 

			        geofenceContainer.selectAll("polyline")
			        	.data( config.geofencesArray )
			        	.enter()
		        		.append('polyline')
			        	.attr('points', function(d, i) {
			        		// remove parenthesis and split by ),(
			        		var points = d.points.replace(/^\(/gm, '').replace(/\)$/gm, '').split("),(");
			        		var pointsArray = [];

							// loop through array and convert to factored numbers
							for (var point = 0, len = points.length; point < len; ++point) {
								var pointItem = points[point].split(','),
									imgWidth  = config.imgWidth,
									imgHeight = config.imgHeight,
									imgID     = config.imgID;
							
								// push converted values to array
								pointsArray.push(
									convertX( parseFloat(pointItem[0]), imgWidth, imgID ) + 
									"," + 
									convertY( parseFloat(pointItem[1]), imgHeight, imgID )
							    );
							}

							// return array of points
							return pointsArray;
						})
						.attr('id', function(d) { return d.geofence_id; })
						.attr('class', 'geofence')
						// click event
			            .on('click', function(d) {                              
							config.callback(d);
	                    })
	                    // click event for touchpad devices
	                    .on('touchstart', function(d) {
	                    	config.callback(d);
	                    })
						.append('svg:title')
			            .text(function (d) {
			                return d.geofence_name;
			            });

			        return geofenceContainer;
			    };

				return {
					drawPolygon       : drawPolygon,
					emptySvgContainer : emptySvgContainer
				};
			}
		]);
		
})(angular);