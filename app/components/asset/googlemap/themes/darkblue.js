/**
 * More themes can be found at: https://snazzymaps.com/explore
 */
var google = google || {};
	google.map = google.map || {};
	google.map.themes = google.map.themes || {};

google.map.themes.darkblue = [
  {
    "featureType": "water",
    "stylers": [
      { "color": "#1a2741" },
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      { "color": "#0e151f" },
      { "visibility": "simplified" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "saturation": -74 },
      { "visibility": "off" },
      { "color": "#808080" }
    ]
  },{
    "elementType": "labels",
    "stylers": [
      { "color": "#3d8080" },
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
  },{
  }
];