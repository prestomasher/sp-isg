/**
 * App configuration module
 * This module holds global app configuration and labels services
 */
(function(ng) {
	angular.
		module('MyApp').

		// CONSTANTS for application. Cannot be intercepted by Decorators
		constant('APP_CONFIG', {
			PRESTO_SERVER: (function() {
				var hostname = window.location.hostname,
					port     = (window.location.port !== '') ? ':' + window.location.port : '',
					server   = 'http://' + hostname + port;	//Use this when running from remote server
					// server = 'http://54.224.113.17:8080';	//Use this when running from local server

				return server;
			}()),

			COMPANY_NAME: '',
			APP_TITLE: 'REALTIME ANALYTICS',
			APP_ICONS: {
				logo: 'logo.png',
				logout: 'appbar.door.leave.png',

				//Admin screen
				man: 'man.png',
				open: 'open.png'
			},

			// Theme color variables. Used in widgets where colors are embedded in javascript vs css
			PRIMARY_COLOR: "#1a2641",		// Used for map water color
			SECONDARY_COLOR: "#292e46",		// Used for background of toolbar area chart
			LANDSCAPE: "#000000",			// Used for map landscape
			ANCHOR_FONT_COLOR: "#88c4e8",	// Used for toolbar area chart series color			
			SUCCESS_COLOR: "#aae200",		// Used for green
			WARNING_COLOR: "#e6d549",		// Used for yellow
			ALERT_COLOR: "#e22020",			// Used for red
			SMOKE: "#EEEEEE"				// Used for white
		});
})(angular);