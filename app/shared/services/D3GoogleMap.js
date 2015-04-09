/**
 * Highcharts sparkline chart
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
    angular.module('MyApp').
        service('D3GoogleMap', [

            '$rootScope', 'APP_CONFIG',
            function($rootScope, APP_CONFIG){
            // private
            // - - - - - - - - - - - - - - - - - - - - - - -
                var map        = null,
                    overlay    = null,
                    projection = null,
                    layer      = null,
                    marker     = null,
                    alertMarkersArray = [];

                //Map theme
                var gTheme = [
                    {
                        "featureType": "water",
                        "stylers": [
                          { "color": APP_CONFIG.PRIMARY_COLOR },
                          { "visibility": "simplified" }
                        ]
                    },{
                        "featureType": "landscape.natural",
                        "elementType": "geometry",
                        "stylers": [
                          { "color": APP_CONFIG.LANDSCAPE },
                          { "visibility": "simplified" }
                        ]
                    },{
                        "featureType": "poi",
                        "stylers": [
                          { "saturation": -74 },
                          { "visibility": "off" }
                        ]
                    },{
                        "elementType": "labels",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                    },{
                        "featureType": "road",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                    },{
                        "featureType": "transit",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                    },{
                        "featureType": "landscape.man_made",
                        "stylers": [
                          { "visibility": "off" }
                        ]
                    },{}
                ];

                /**
                 * This code adds maptheme and default layers and changes them depending on zoomLevel
                 * @type {Object}
                 */
                function _setMapStyles() {
                
                    var themedMapOptions = { map: map, name: 'maptheme' };
                    var normalMapOptions   = { map: map, name: 'default' };

                    var darkStyledMapType = new google.maps.StyledMapType( gTheme, themedMapOptions );
                        map.mapTypes.set( 'maptheme', darkStyledMapType );
                        map.setMapTypeId( 'maptheme' );

                    var defaultStyledMapType = new google.maps.StyledMapType( [{}], normalMapOptions );
                        map.mapTypes.set( 'default', defaultStyledMapType );

                    google.maps.event.addListener(map, 'zoom_changed', function() {
                        var zoomLevel = map.getZoom();
                        
                        if(zoomLevel >= 6)
                            map.setMapTypeId('default');
                        else
                            map.setMapTypeId('maptheme');
                    });
                }

            // public
            // - - - - - - - - - - - - - - - - - - - - - - -
                var drawMap = function( config ) {
                    // Create the Google Map…
                    map = new google.maps.Map(d3.select( config.container ).node(), {
                        zoom: 3,
                        center: new google.maps.LatLng(38.6908333333, 48.14055555556),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

                    _setMapStyles();

                    overlay = new google.maps.OverlayView(); 

                    // Add the container when the overlay is added to the map.
                    overlay.onAdd = function() {
                        layer = d3.select(this.getPanes().overlayMouseTarget).append("div")
                            .attr("class", "stations");

                        projection = this.getProjection();    

                        addMarker( config.data );
                    };

                  // Bind our overlay to the map…
                  overlay.setMap( map );   
                };

                //Adds Markers form data
                var addMarker = function( data ) {
                    var dataArray = ( angular.isArray(data) ) ? data : [ data ];
                
                    // Draw each marker as a separate SVG element.
                    // We could use a single SVG, but what size would it have?
                    overlay.draw = function() {
                        var minWidth = 8,
                            AlertCount = 0;                            

                        // Add marker
                        marker = layer.selectAll("svg")
                            .data(d3.entries(dataArray))
                            .each(transform) // update existing markers
                            .enter().append("svg:svg")
                            .each(transform)
                            .attr("width", function(d) { 
                                AlertCount = getAlertCount(d);

                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount) * 2 + 10;
                            })
                            .attr("height", function(d) {
                                AlertCount = getAlertCount(d);
                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount) * 2 + 10;
                            })
                            .attr("class", "marker")
                            .on('click', function(d) {                              
                                $rootScope.$broadcast( 'mapMarkerClicked', d);
                            });

                        // Add a circle.
                        marker.append("svg:circle")
                            .attr("r", function(d) {
                                AlertCount = getAlertCount(d);
                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount);
                            })
                            .attr("class", getMarkerStyle)
                            .attr("cx", function(d) {
                                AlertCount = getAlertCount(d);
                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount) + 5;
                            })
                            .attr("cy", function(d) {
                                AlertCount = getAlertCount(d);
                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount) + 5;
                            });

                        // Add a label.
                        marker.append("text")
                            .style("text-anchor", "middle")
                            .attr("x", function(d) {
                                AlertCount = getAlertCount(d);
                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount) + 5;
                            })
                            .attr("y", function(d) {
                                AlertCount = getAlertCount(d);
                                if(AlertCount < minWidth) {
                                    AlertCount = minWidth;    
                                }
                                return parseInt(AlertCount) + 9;
                            })
                            .text(function(d) { 

                                return getAlertCount(d); });
                    };
                };

                // transforms lat long to pixels
                function transform(d) {
                    var alertCnt = getAlertCount(d);

                    d = new google.maps.LatLng(d.value.lat, d.value.lng);
                    d = projection.fromLatLngToDivPixel(d);
                  
                    return d3.select(this)
                        .style("left", (d.x - alertCnt) + "px")
                        .style("top",  (d.y - alertCnt) + "px");
                }

                // returns circle style
                function getMarkerStyle(d) {
                    var cls = 'green',
                        severity = parseInt(d.value.normal),
                        severityType = 'normal';

                    if( parseInt(d.value.warning) > severity ) {
                        severity = parseInt(d.value.warning);
                        severityType = "warning";
                    } 
                    if( parseInt(d.value.alert) > severity ) {
                        severity = parseInt(d.value.alert);
                        severityType = "alert";
                    }
                    
                    if( severityType === 'warning' ) {
                        cls = 'yellow';
                    } else if( severityType === 'alert' ) {
                        cls = 'selected-red';
                    }

                    return cls;
                }

                // 
                function getAlertCount( record ) {
                    var rec = record.value,
                        cnt = parseInt(rec.normal) + parseInt(rec.warning) + parseInt(rec.alert);

                    return cnt;
                }

                return {
                    drawMap   : drawMap,
                    addMarker : addMarker
                };
            }]);
        
})(angular);