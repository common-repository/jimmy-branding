/**
 * window-opener.js in Jimmy Branding, a WordPress plugins
 * @package Jimmy Branding
 * @author Kenta Ishii
 * License: GPLv2 or later
 */

var JIMMY_BRANDING = JIMMY_BRANDING || {};

JIMMY_BRANDING.windowOpener = function( id_content, id_opener ) {
	id_content = '#' + id_content;
	id_opener = '#' + id_opener;
	// Height Changer
	(function( $ ) {

		var is_open = false;

		var ht_min = $( id_content ).data('min');
		var ht_max = $( id_content ).data('max');
		var op_color = $( id_content ).data('color');

		var ht_min_percents;
		var ht_max_percents;
		if ( $( id_content ).data('minpercents') ) {
			ht_min_percents = $( id_content ).data('minpercents');
			ht_min_percents = ht_min_percents / 100;
		}
		if ( $( id_content ).data('maxpercents') ) {
			ht_max_percents = $( id_content ).data('maxpercents');
			ht_max_percents = ht_max_percents / 100;
		}

		var choice;
		var element;
		var is_parent = true;
		if ( $( id_content ).data('choice') ) {
			choice = $( id_content ).data('choice');
			if ( 'parent' === choice ) {
				element = $( id_content ).parent();
			} else if ( 'window' === choice ) {
				element = $( window );
				is_parent = false;
			}
		}

		sizeChange();

		$( window ).bind('resize.wpevent_jimmy_branding', function( e ) {
			sizeChange();
			// In jQuery and JavaScript, return true in event listener means nothing, unlike return false
			//return true;
		});

		/**
		 * Node.innerWidth() of jQuery includes padding, equivalent to Node.clientWidth of JavaScript
		 */
		function sizeChange() {
			if ( $( id_content ).data('minpercents') ) {
				if ( is_parent ) {
					ht_min = element.innerWidth() * ht_min_percents;
				} else {
					// Exclude Scroll Bar Size
					ht_min = element.height() * ht_min_percents;
				}
				ht_min = parseInt( ht_min ) + 'px';
				if ( ! is_open ) {
					$( id_content ).css('height', ht_min );
				}
			}
			if ( $( id_content ).data('maxpercents') ) {
				if ( is_parent ) {
					ht_max = element.innerWidth() * ht_max_percents;
				} else {
					// Exclude Scroll Bar Size
					ht_max = element.height() * ht_max_percents;
				}
				ht_max = parseInt( ht_max ) + 'px';
				if ( is_open ) {
					$( id_content ).css('height', ht_max );
				}
			}
		}

		// In jQuery, return false means preventDefault and stopPropagation
		// In JavaScript, return false means only preventDefault or nothing
		$( id_opener ).bind('click.wpevent_jimmy_branding', function( e ) {
			if ( ! is_open ) {
				$( id_content ).css('height', ht_max );
				$( id_opener ).css({
							'border-top': 'none',
							'border-bottom': '0.9em solid ' + op_color
							});
				is_open = true;
			} else if ( is_open ) {
				$( id_content ).css('height', ht_min );
				$( id_opener ).css({
							'border-top': '0.9em solid ' + op_color,
							'border-bottom': 'none'
							});
				is_open = false;
			}
			
			return false;
		});
	})( jQuery );
};