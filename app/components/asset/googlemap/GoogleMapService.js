/**
 * Google Maps service
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {

    angular.module('MyApp').
        service('GMapService', [ 
            
            '$rootScope', 'assetModel', 'APP_CONFIG',
            function($rootScope, assetModel, APP_CONFIG) {
                var map = null,
                    InfoWindow = null,
                    bounds = null;

                assetModel.markers = [];    

                var drawMap = function( dataArray ) {
                    var myLatlng = new google.maps.LatLng(48.6908333333, 9.14055555556);
                    
                    var mapOptions = {
                        zoom: 4,
                        center: myLatlng,
                        panControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                        },
                        zoomControl: true,
                        zoomControlOptions: {
                            style: google.maps.ZoomControlStyle.LARGE
                        }
                    };

                    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    bounds = new google.maps.LatLngBounds();
                    infowindow = new google.maps.InfoWindow();
                    
                    //Will change to default map after a certain zoom level
                    //Comment this line to go to default styles
                    _setMapStyles();

                    // _drawBuildingsForUser( dataArray );
                    _drawMarkers( dataArray );
                };

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

                function _drawMarkers( dataArray ) {
                    for (var data = 0, len = dataArray.length; data < len; ++data) {
                        var dataItem = dataArray[data];
                        
                        addMarker( dataItem );                    
                    }

                    map.fitBounds(bounds); 
                }

                /**
                 * draws marker
                 * @param {JSON} dataItem data object
                 */
                function addMarker( dataItem ) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng( dataItem.Latitude, dataItem.Longitude ),
                        map: map,
                        icon: getIconByRule( dataItem.Severity )
                    });

                    bounds.extend(new google.maps.LatLng( dataItem.Latitude, dataItem.Longitude ));

                    google.maps.event.addListener(marker, 'click', function() {
                        $rootScope.$broadcast( 'mapMarkerClicked', dataItem);
                    });
                }

                function getIconByRule( data ){
                    var icon = 'assets/images/circle-green.png';

                    if( data.toLowerCase() === 'warning' ) {
                        icon = 'assets/images/circle-yellow.png';
                    } else if ( data.toLowerCase() === 'alert' ) {
                        icon = 'assets/images/circle-red.png';
                    }

                    return icon;
                }

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

                return {
                    drawMap: drawMap,
                    map: map,
                    InfoWindow: InfoWindow,
                    bounds: bounds
                };
            }
        ]);
})(angular);