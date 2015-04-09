/**
 * Service for floorplan screen
 * @author  Jorge.Carmona@softwareag.com
 */
(function(ng) {
	angular.module('MyApp').

		service('panZoomService', [

			function(){
				
				/**
				 * set new panzoom object
				 * @param  {String} focalId id of element to convert to a panzoom object
				 */
				var startPanZoom = function( focalId ) {
					var $section = $( '#' + ( focalId || 'focal' ) );
					var $panzoom = $section.find('.panzoom').panzoom();

					$panzoom.parent().on('mousewheel.focal', function( e ) {
						e.preventDefault();

						var delta = e.delta || e.originalEvent.wheelDelta;
						var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
						
						$panzoom.panzoom('zoom', zoomOut, {
							increment: 0.1,
							animate: false,
							focal: e
						});
					});
				};

				/**
				 * destroy panzoom object
				 * @param  {String} focalId id of focal element to destroy
				 */
				var destroy = function(focalId) {
					$('#' + focalId ).find( '.panzoom' ).panzoom( 'destroy' );
				};

				/**
				 * resets zoom and pan
				 * @param  {String} focalId if of focal element to reset
				 */
				var reset = function(focalId) {
					$('#' + focalId ).find( '.panzoom' ).panzoom( 'reset' );
				};

				return {
					startPanZoom : startPanZoom,
					destroy      : destroy,
					reset        : reset
				};
		}]);
		
})(angular);