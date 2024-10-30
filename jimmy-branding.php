<?php
/*
Plugin Name: Jimmy Branding
Plugin URI: http://electronics.jimmykenmerchant.com/jimmy-branding/
Description: Flexible Branding Banner with WebGL
Author: Kenta Ishii
Author URI: http://electronics.jimmykenmerchant.com
Version: 1.0.4
Text Domain: jimmy-branding
Domain Path: /languages
License: GPL2 or Later
*/

/**
 * Add Custom Post type, article
 */
function jimmy_branding_create_post_type() {
	register_post_type(
		'jbranding',
		array(
			'labels' => array(
				'name' => __( 'jBrandings' ),
				'singular_name' => __( 'jBranding' ),
			),
			'supports' => array(
				'title',
				'editor',
				'author',
				'revisions',
			),
			'public' => false,
			'has_archive' => false,
			'show_ui' => true,
			'capability_type' => array( 'jbranding', 'jbrandings' ),
			'map_meta_cap' => true,
			'menu_position' => 20,
		)
	);
}
add_action( 'init', 'jimmy_branding_create_post_type' );


/**
 * Role Making "jpromoter" to only edit or delete jbranding on activation
 */
function jimmy_branding_roles_customize() {
	$capabilities = array(
			'edit_posts' => 'edit_jbrandings',
			'edit_others_posts' => 'edit_others_jbrandings',
			'edit_private_posts' => 'edit_private_jbrandings',
			'edit_published_posts' => 'edit_published_jbrandings',
			'delete_posts' => 'delete_jbrandings',
			'delete_others_posts' => 'delete_others_jbrandings',
			'delete_private_posts' => 'delete_private_jbrandings',
			'delete_published_posts' => 'delete_published_jbrandings',
			'publish_posts' => 'publish_jbrandings',
			'read_private_posts' => 'read_private_jbrandings',
			);

	$role = get_role( 'administrator' );
	foreach ( $capabilities as $cap ) {
		$role->add_cap( $cap );
	}

	$role = get_role( 'editor' );
	foreach ( $capabilities as $cap ) {
		$role->add_cap( $cap );
	}

	add_role( 'jpromoter', 'jPromoter',
		 array( 'read' => true,
			'edit_jbrandings' => true,
			'delete_jbrandings' => true,
		) );

	add_option( 'jimmy_branding_option_content', 0 );
	add_option( 'jimmy_branding_option_width', 1000 );
	add_option( 'jimmy_branding_option_width_percents', 100 );
	add_option( 'jimmy_branding_option_height_min', 100 );
	add_option( 'jimmy_branding_option_height_min_percents', 10 );
	add_option( 'jimmy_branding_option_height_max', 200 );
	add_option( 'jimmy_branding_option_height_max_percents', 20 );
	add_option( 'jimmy_branding_option_res_choice', esc_html( 'actual' ) );
	add_option( 'jimmy_branding_option_color_opener', esc_html( 'rgba(255, 255, 0, 0.6)' ) );
	add_option( 'jimmy_branding_option_width_opener', 34 );
	add_option( 'jimmy_branding_option_opener_choice', esc_html( 'display' ) );
	add_option( 'jimmy_branding_option_webgl_choice', esc_html( 'none' ) );
	add_option( 'jimmy_branding_option_shortcode_choice', esc_html( 'none' ) );

}
register_activation_hook( __FILE__, 'jimmy_branding_roles_customize' );


/**
 * Role Delete on Deactivation
 */
function jimmy_branding_roles_retrieve() {
	$capabilities = array(
			'edit_posts' => 'edit_jbrandings',
			'edit_others_posts' => 'edit_others_jbrandings',
			'edit_private_posts' => 'edit_private_jbrandings',
			'edit_published_posts' => 'edit_published_jbrandings',
			'delete_posts' => 'delete_jbrandings',
			'delete_others_posts' => 'delete_others_jbrandings',
			'delete_private_posts' => 'delete_private_jbrandings',
			'delete_published_posts' => 'delete_published_jbrandings',
			'publish_posts' => 'publish_jbrandings',
			'read_private_posts' => 'read_private_jbrandings',
			);

	$role = get_role( 'administrator' );
	foreach ( $capabilities as $cap ) {
		$role->remove_cap( $cap );
	}

	$role = get_role( 'editor' );
	foreach ( $capabilities as $cap ) {
		$role->remove_cap( $cap );
	}

	remove_role( 'jpromoter' );

	delete_option( 'jimmy_branding_option_content' );
	delete_option( 'jimmy_branding_option_width' );
	delete_option( 'jimmy_branding_option_width_percents' );
	delete_option( 'jimmy_branding_option_height_min' );
	delete_option( 'jimmy_branding_option_height_min_percents' );
	delete_option( 'jimmy_branding_option_height_max' );
	delete_option( 'jimmy_branding_option_height_max_percents' );
	delete_option( 'jimmy_branding_option_res_choice' );
	delete_option( 'jimmy_branding_option_color_opener' );
	delete_option( 'jimmy_branding_option_width_opener' );
	delete_option( 'jimmy_branding_option_opener_choice' );
	delete_option( 'jimmy_branding_option_webgl_choice' );
	delete_option( 'jimmy_branding_option_shortcode_choice' );
}
register_deactivation_hook( __FILE__, 'jimmy_branding_roles_retrieve' );


/**
 * Add Script and Style
 * Adding jQuery script needs completely loading of a jQuery library and almostly loading of DOM
 */
function jimmy_branding_script() {

	if ( ! empty( get_option( 'jimmy_branding_option_content' ) ) ) {

		if ( 'none' !== get_option( 'jimmy_branding_option_webgl_choice' ) ) {
			wp_enqueue_script( 'jimmy-branding-senor-webgl',  plugins_url( 'js/senor-webgl.min.js', __FILE__ ), array(), '1.0' );
			wp_enqueue_script( 'jimmy-branding-attacher-webgl',  plugins_url( 'js/attacher-webgl.min.js', __FILE__ ), array( 'jimmy-branding-senor-webgl' ), '1.0' );
		}

		if ( 'display' === get_option( 'jimmy_branding_option_opener_choice' ) ) {
			wp_enqueue_script( 'jimmy-branding-window-opener',  plugins_url( 'js/window-opener.min.js', __FILE__ ), array( 'jquery' ), '1.0' );
		}

		wp_enqueue_style( 'jimmy-branding-style',  plugins_url( 'style-jimmy-branding.css', __FILE__ ), array(), '1.0' );
	} else {

		if ( 'alone' === get_option( 'jimmy_branding_option_webgl_choice' ) ) {
			wp_enqueue_script( 'jimmy-branding-senor-webgl',  plugins_url( 'js/senor-webgl.min.js', __FILE__ ), array(), '1.0' );
			wp_enqueue_script( 'jimmy-branding-attacher-webgl',  plugins_url( 'js/attacher-webgl.min.js', __FILE__ ), array( 'jimmy-branding-senor-webgl' ), '1.0' );
		}

		if ( 'use' === get_option( 'jimmy_branding_option_shortcode_choice' ) ) {
			wp_enqueue_script( 'jimmy-branding-window-opener',  plugins_url( 'js/window-opener.min.js', __FILE__ ), array( 'jquery' ), '1.0' );
			wp_enqueue_style( 'jimmy-branding-style',  plugins_url( 'style-jimmy-branding.css', __FILE__ ), array(), '1.0' );
		}

	}

	return true;
}
add_action( 'wp_enqueue_scripts', 'jimmy_branding_script' );


/**
 * Add Admin Script and Style
 */
function jimmy_branding_admin_script() {
	if ( 'none' !== get_option( 'jimmy_branding_option_webgl_choice' ) ) {
		wp_enqueue_script( 'jimmy-branding-senor-webgl',  plugins_url( 'js/senor-webgl.min.js', __FILE__ ), array(), '1.0' );
		wp_enqueue_script( 'jimmy-branding-attacher-webgl',  plugins_url( 'js/attacher-webgl.min.js', __FILE__ ), array( 'jimmy-branding-senor-webgl' ), '1.0' );
	}

	wp_enqueue_style( 'jimmy-branding-admin-style',  plugins_url( 'style-jimmy-branding-admin.css', __FILE__ ), array(), null );

	return true;
}
add_action( 'admin_enqueue_scripts', 'jimmy_branding_admin_script' );


/**
 * Add sub menu
 */
function jimmy_branding_admin_submenu() {
	add_submenu_page( 'edit.php?post_type=jbranding', 'Select', 'Select', 'publish_brandings', 'jimmy-branding-select', 'jimmy_branding_select_menu');
	return true;
}
add_action( 'admin_menu', 'jimmy_branding_admin_submenu' );


/**
 * Sub menu itself
 */
function jimmy_branding_select_menu() {

	if ( isset( $_POST['jimmy_branding_change'] ) ) {

		$jimmy_branding_option_content = $_POST['jimmy_branding_content'];

		if ( (int) $jimmy_branding_option_content !== -1 ) {
			update_option( 'jimmy_branding_option_content', $jimmy_branding_option_content );
		} else {
			update_option( 'jimmy_branding_option_content', 0 );
		}

	}

	// If option does not exist or no valid value, returns false
	if ( ! empty( get_option( 'jimmy_branding_option_content' ) ) ) {
		$branding_post = get_post( (int) get_option( 'jimmy_branding_option_content' ) );
		$branding_id = $branding_post->ID;
		$branding_now = $branding_post->post_title;
	} else {
		//$branding_post = NULL; // The Same as no declaration, so no need in PHP 
		$branding_id = -1;
		$branding_now = 'NO SELECTION';
	}

	$branding_query = new WP_Query( array(
						'post_type' => 'jbranding',
						'post_status' => 'publish',
						'orderby' => 'modified',
					));

?>
<div id="jimmy-branding-admin-nowon">
Now On: <?php echo $branding_now; ?>
</div>
<?php
	if ( isset( $_POST['jimmy_branding_preview'] ) ) {

		if ( (int) $_POST['jimmy_branding_content'] !== -1 ) {
			$branding_post = get_post( (int) $_POST['jimmy_branding_content'] );
			$branding_id = $branding_post->ID;
			$branding_now = $branding_post->post_title;
		} else {
			unset( $branding_post );
			$branding_id = -1;
			$branding_now = "NO SELECTION";
		}

	}
?>
<form id="template" class="jimmy-branding-admin-form" action="<?php echo admin_url( 'edit.php?post_type=jbranding&page=jimmy-branding-select' ); ?>" method="post">
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Select Branding:</label>
		<select name="jimmy_branding_content">
<?php
	echo "\t\t\t" . '<option value="' . $branding_id . '">' . $branding_now . '</option>' . "\r\n";

	while ( $branding_query->have_posts() ) {
		$branding_query->the_post();
		if ( $branding_id !== get_the_ID() ) {
			echo "\t\t\t" . '<option value="' . get_the_ID() . '">' . get_the_title() . '</option>' . "\r\n";
		}
	}

	wp_reset_postdata();

	if ( $branding_id !== -1) {
		echo "\t\t\t" . '<option value="-1">NO SELECTION</option>' . "\r\n";
	}
?>
		</select>
		<input class="jimmy-branding-admin-input button" type="submit" name="jimmy_branding_preview" value="Preview" unselectable="on" />
	</div>
<?php
	if ( isset( $branding_post ) ) :
		if ( ! empty( $branding_post->ID ) && $branding_post->post_status === 'publish' && $branding_post->post_type === 'jbranding' && empty( $branding_post->post_password ) ) :
?>
	<div id="jimmy-branding-admin-preview-title">
		Preview: <?php echo $branding_post->post_title; ?>
	</div>
	<div id="jimmy-branding-admin-preview">
		<div id="jimmy-branding-admin-preview-content">
			<?php echo $branding_post->post_content . "\r\n"; ?>
		</div>
	</div>
<?php
		endif;
	endif;

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_width = (int) $_POST['jimmy_branding_width_value'];
		if ( $jimmy_branding_option_width !== get_option( 'jimmy_branding_option_width' ) ) {
			update_option( 'jimmy_branding_option_width', $jimmy_branding_option_width );
		}
	} else {
		$jimmy_branding_option_width = get_option( 'jimmy_branding_option_width' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Width:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_width_value" value="<?php echo $jimmy_branding_option_width; ?>" max="9999" min="1" unselectable="on" />
		<label unselectable="on">pixels</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_width_percents = (int) $_POST['jimmy_branding_width_percents_value'];
		if ( $jimmy_branding_option_width_percents !== get_option( 'jimmy_branding_option_width_percents' ) ) {
			update_option( 'jimmy_branding_option_width_percents', $jimmy_branding_option_width_percents );
		}
	} else {
		$jimmy_branding_option_width_percents = get_option( 'jimmy_branding_option_width_percents' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Width by<br />Ratio:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_width_percents_value" value="<?php echo $jimmy_branding_option_width_percents; ?>" max="100" min="1" unselectable="on" />
		<label unselectable="on">percents</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_height_min = (int)$_POST['jimmy_branding_height_min_value'];
		if ( $jimmy_branding_option_height_min !== get_option( 'jimmy_branding_option_height_min' ) ) {
			update_option( 'jimmy_branding_option_height_min', $jimmy_branding_option_height_min );
		}
	} else {
		$jimmy_branding_option_height_min = get_option( 'jimmy_branding_option_height_min' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Minimum Height:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_height_min_value" value="<?php echo $jimmy_branding_option_height_min; ?>" max="9999" min="1" unselectable="on" />
		<label unselectable="on">pixels</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_height_min_percents = (int)$_POST['jimmy_branding_height_min_percents_value'];
		if ( $jimmy_branding_option_height_min_percents !== get_option( 'jimmy_branding_option_height_min_percents' ) ) {
			update_option( 'jimmy_branding_option_height_min_percents', $jimmy_branding_option_height_min_percents );
		}
	} else {
		$jimmy_branding_option_height_min_percents = get_option( 'jimmy_branding_option_height_min_percents' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Minimum Height<br />by Ratio:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_height_min_percents_value" value="<?php echo $jimmy_branding_option_height_min_percents; ?>" max="400" min="1" unselectable="on" />
		<label unselectable="on">percents</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_height_max = (int)$_POST['jimmy_branding_height_max_value'];
		if ( $jimmy_branding_option_height_max !== get_option( 'jimmy_branding_option_height_max' ) ) {
			update_option( 'jimmy_branding_option_height_max', $jimmy_branding_option_height_max );
		}
	} else {
		$jimmy_branding_option_height_max = get_option( 'jimmy_branding_option_height_max' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Maximum Height:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_height_max_value" value="<?php echo $jimmy_branding_option_height_max; ?>" max="9999" min="1" unselectable="on" />
		<label unselectable="on">pixels</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_height_max_percents = (int)$_POST['jimmy_branding_height_max_percents_value'];
		if ( $jimmy_branding_option_height_max_percents !== get_option( 'jimmy_branding_option_height_max_percents' ) ) {
			update_option( 'jimmy_branding_option_height_max_percents', $jimmy_branding_option_height_max_percents );
		}
	} else {
		$jimmy_branding_option_height_max_percents = get_option( 'jimmy_branding_option_height_max_percents' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Maximum Height by Ratio:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_height_max_percents_value" value="<?php echo $jimmy_branding_option_height_max_percents; ?>" max="400" min="1" unselectable="on" />
		<label unselectable="on">percents</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_res_choice = esc_html( $_POST['jimmy_branding_res_choice_value'] );
		if ( $jimmy_branding_option_res_choice !== get_option( 'jimmy_branding_option_res_choice' ) ) {
			update_option( 'jimmy_branding_option_res_choice', $jimmy_branding_option_res_choice );
		}
	} else {
		$jimmy_branding_option_res_choice = get_option( 'jimmy_branding_option_res_choice' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Resolution by:</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_res_choice_value" value="actual"<?php if ( 'actual' === $jimmy_branding_option_res_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Pixels</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_res_choice_value" value="ratio_p"<?php if ( 'ratio_p' === $jimmy_branding_option_res_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Ratio by Parent Width</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_res_choice_value" value="ratio_w"<?php if ( 'ratio_w' === $jimmy_branding_option_res_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Ratio by Window Width &amp; Height</label>
	</div>
<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_color_opener = esc_html( $_POST['jimmy_branding_color_opener_value'] );
		if ( $jimmy_branding_option_color_opener !== get_option( 'jimmy_branding_option_color_opener' ) ) {
			update_option( 'jimmy_branding_option_color_opener', $jimmy_branding_option_color_opener );
		}
	} else {
		$jimmy_branding_option_color_opener = get_option( 'jimmy_branding_option_color_opener' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Opener Color:</label>
		<input class="jimmy-branding-admin-input" type="text" name="jimmy_branding_color_opener_value" value="<?php echo $jimmy_branding_option_color_opener; ?>" size="30" maxlength="24" pattern="^[0-9a-z\s\(\)\.,#]+$" unselectable="on" />
		<label unselectable="on">Color Name or Numerical Code</label>
	</div>
<?php 

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_width_opener = (int)$_POST['jimmy_branding_width_opener_value'];
		if ( $jimmy_branding_option_width_opener !== get_option( 'jimmy_branding_option_width_opener' ) ) {
			update_option( 'jimmy_branding_option_width_opener', $jimmy_branding_option_width_opener );
		}
	} else {
		$jimmy_branding_option_width_opener = get_option( 'jimmy_branding_option_width_opener' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Opener Width:</label>
		<input class="jimmy-branding-admin-input" type="number" name="jimmy_branding_width_opener_value" value="<?php echo $jimmy_branding_option_width_opener; ?>" max="200" min="1" unselectable="on" />
		<label unselectable="on">pixels</label>
	</div>

<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_opener_choice = esc_html( $_POST['jimmy_branding_opener_choice_value'] );
		if ( $jimmy_branding_option_opener_choice !== get_option( 'jimmy_branding_option_opener_choice' ) ) {
			update_option( 'jimmy_branding_option_opener_choice', $jimmy_branding_option_opener_choice );
		}
	} else {
		$jimmy_branding_option_opener_choice = get_option( 'jimmy_branding_option_opener_choice' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Opener:</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_opener_choice_value" value="display"<?php if ( 'display' === $jimmy_branding_option_opener_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Display</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_opener_choice_value" value="none"<?php if ( 'none' === $jimmy_branding_option_opener_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">None</label>
	</div>

<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_webgl_choice = esc_html( $_POST['jimmy_branding_webgl_choice_value'] );
		if ( $jimmy_branding_option_webgl_choice !== get_option( 'jimmy_branding_option_webgl_choice' ) ) {
			update_option( 'jimmy_branding_option_webgl_choice', $jimmy_branding_option_webgl_choice );
		}
	} else {
		$jimmy_branding_option_webgl_choice = get_option( 'jimmy_branding_option_webgl_choice' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">SENOR WebGL Library:</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_webgl_choice_value" value="alone"<?php if ( 'alone' === $jimmy_branding_option_webgl_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Stand Alone</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_webgl_choice_value" value="only"<?php if ( 'only' === $jimmy_branding_option_webgl_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Only with Jimmy Branding</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_webgl_choice_value" value="none"<?php if ( 'none' === $jimmy_branding_option_webgl_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">None</label>
	</div>

<?php

	if ( isset( $_POST['jimmy_branding_change'] ) ) {
		$jimmy_branding_option_shortcode_choice = esc_html( $_POST['jimmy_branding_shortcode_choice_value'] );
		if ( $jimmy_branding_option_shortcode_choice !== get_option( 'jimmy_branding_option_shortcode_choice' ) ) {
			update_option( 'jimmy_branding_option_shortcode_choice', $jimmy_branding_option_shortcode_choice );
		}
	} else {
		$jimmy_branding_option_shortcode_choice = get_option( 'jimmy_branding_option_shortcode_choice' );
	}

?>
	<div class="jimmy-branding-admin-form-section">
		<label unselectable="on">Shortcode Usage:</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_shortcode_choice_value" value="use"<?php if ( 'use' === $jimmy_branding_option_shortcode_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">Use</label>
		<input class="jimmy-branding-admin-input" type="radio" name="jimmy_branding_shortcode_choice_value" value="none"<?php if ( 'none' === $jimmy_branding_option_shortcode_choice ) { echo ' checked="checked"'; }?> unselectable="on" />
		<label unselectable="on">None</label>
	</div>

	<div class="jimmy-branding-admin-form-section">
		<input class="jimmy-branding-admin-input button button-primary" type="submit" name="jimmy_branding_change" value="Change" unselectable="on" />
<?php
	if ( isset( $_POST['jimmy_branding_change'] ) ) :
?>
		<label unselectable="on">Updated!</label>
<?php
	endif;
?>
	</div>
</form>
<?php
	return true;
}

/**
 * Template tag to use in your theme
 *
 * Use below code in your theme template to the branding output. Just like below in PHP
 *
 *	if ( function_exists( 'jimmy_branding_output' ) ) {
 *		jimmy_branding_output();
 *	}
 *
 */
function jimmy_branding_output( $id_pre = 'jimmy-branding' ) {
	$id_content = $id_pre . '-content';
	$id_opener = $id_pre . '-opener';

	if ( ! get_option( 'jimmy_branding_option_content' ) ) {
		return false;
	} else {
		$jimmy_branding_option_content = get_option( 'jimmy_branding_option_content' );
		$branding_post = get_post( (int) $jimmy_branding_option_content );

		if ( isset( $branding_post ) ) {
			if ( ! empty( $branding_post->ID ) && $branding_post->post_status === 'publish' && $branding_post->post_type === 'jbranding' && empty( $branding_post->post_password ) ) {
				$branding_now = $branding_post->post_content;
				$jimmy_branding_option_width = get_option( 'jimmy_branding_option_width' );
				$jimmy_branding_option_width_percents = get_option( 'jimmy_branding_option_width_percents' );
				$jimmy_branding_option_height_min = get_option( 'jimmy_branding_option_height_min' );
				$jimmy_branding_option_height_min_percents = get_option( 'jimmy_branding_option_height_min_percents' );
				$jimmy_branding_option_height_max = get_option( 'jimmy_branding_option_height_max' );
				$jimmy_branding_option_height_max_percents = get_option( 'jimmy_branding_option_height_max_percents' );
				$jimmy_branding_option_res_choice = get_option( 'jimmy_branding_option_res_choice' );
				$jimmy_branding_option_color_opener = get_option( 'jimmy_branding_option_color_opener' );
				$jimmy_branding_option_width_opener = get_option( 'jimmy_branding_option_width_opener' );
				$jimmy_branding_option_opener_choice = get_option( 'jimmy_branding_option_opener_choice' );
			} else {
				return false;
			}
		} else {
			return false;
		}

	}
?>
	<div class="jimmy-branding-wrap">
		<div id="<?php echo $id_content; ?>" class="jimmy-branding-content" style="width: <?php

	if ( 'actual' !== $jimmy_branding_option_res_choice ) {
		echo $jimmy_branding_option_width_percents . '%';
	} else {
		echo $jimmy_branding_option_width . 'px';
	}

?>;height: <?php

	echo $jimmy_branding_option_height_min;

?>px;" data-min="<?php

	echo $jimmy_branding_option_height_min;

?>px"<?php

	if ( 'actual' !== $jimmy_branding_option_res_choice ) {
		echo ' data-minpercents="' . $jimmy_branding_option_height_min_percents . '"';
	}

?> data-max="<?php

	echo $jimmy_branding_option_height_max;

?>px"<?php

	if ( 'actual' !== $jimmy_branding_option_res_choice ) {
		echo ' data-maxpercents="' . $jimmy_branding_option_height_max_percents . '"';
		echo ' data-widthpercents="' . $jimmy_branding_option_width_percents . '"';
	}

?> data-color="<?php

	echo $jimmy_branding_option_color_opener;

?>"<?php

	if ( 'actual' !== $jimmy_branding_option_res_choice ) {
		if ( 'ratio_p' === $jimmy_branding_option_res_choice ) {
			echo ' data-choice="parent"';
		} elseif ( 'ratio_w' === $jimmy_branding_option_res_choice ) {
			echo ' data-choice="window"';
		}
	}

?>>
<?php
	echo $branding_now . "\r\n";

	if ( $jimmy_branding_option_opener_choice === 'display' ) :
?>
			<div id="<?php echo $id_opener; ?>" class="jimmy-branding-opener" style="font-size: <?php echo $jimmy_branding_option_width_opener; ?>px;border-top: 0.9em solid <?php echo $jimmy_branding_option_color_opener; ?>;">
				<span class="screen-reader-text">
					<?php echo 'Expand Branding' . "\r\n"; ?>
				</span>
			</div>
<?php
	endif;
?>
		</div>
	</div><!-- .jimmy-branding-wrap -->
<script type="text/javascript" defer>
JIMMY_BRANDING.windowOpener( "<?php echo $id_content; ?>", "<?php echo $id_opener; ?>" );
</script>
<?php

	return true;
}


/**
 * Make shortcode [jimmy_branding]
 * e.g. [jimmy_branding id="" name=""]
 * Make Stand Alone Jimmy Branding Window
 * Ratio is enabled. Be cautious that its width ratio depends on the parent element
 */
function jimmy_branding_shortcode_jimmy_branding( $atts ) {
	$arr = shortcode_atts(
		array( 'id' => 'jimmy-branding',
			'name' => '',
			'ratio' => 'false', // false, parent, window
			'width_pixels' => '300',
			'width_percents' => '100',
			'height_min' => '100',
			'height_min_percents' => '10',
			'height_max' => '200',
			'height_max_percents' => '20',
			'opener_color' => 'rgba(255, 255, 0, 0.6)',
			'opener_width' => '34',
			'opener_choice' => 'true',
		),
		$atts );

	$id_content = $arr['id'] . '-content';
	$id_opener = $arr['id'] . '-opener';

	if ( 'FALSE' === $arr['ratio'] ) $arr['ratio'] = 'false';

	if ( 'TRUE' === $arr['opener_choice'] ) $arr['opener_choice'] = 'true';

	// To safety, return Error
	if ( empty( $arr['name'] ) ) return "Error (jimmy-branding: 1100)";

	// Get Content
	$branding = get_page_by_path( $arr['name'], OBJECT, 'jbranding' );
	if ( isset( $branding ) ) {
		if ( ! empty( $branding->ID ) && $branding->post_status === "publish" && $branding->post_type === "jbranding" && empty( $branding->post_password ) ) {
			$content_text = $branding->post_content;
		} else {
			return "Error (jimmy-codeviewer: 1102)";
		}
	} else {
		return "Error (jimmy-branding: 1101)";
	}

	$return_str = '<div class="jimmy-branding-wrap">' . "\r\n";
	$return_str .=	"\t" . '<div id="' . $id_content . '" class="jimmy-branding-content" style="width: ';

	if ( 'false' !== $arr['ratio'] ) {
		$return_str .= $arr['width_percents'] . '%';
	} else {
		$return_str .= $arr['width_pixels'] . 'px';
	}

	$return_str .= ';height: ';

	$return_str .= $arr['height_min'] . 'px';

	$return_str .= ';" data-min="';

	$return_str .= $arr['height_min'] . 'px"';

	if ( 'false' !== $arr['ratio'] ) {
		$return_str .= ' data-minpercents="' . $arr['height_min_percents'] . '"';
	}

	$return_str .= ' data-max="';

	$return_str .= $arr['height_max'] . 'px"';

	if ( 'false' !== $arr['ratio'] ) {
		$return_str .= ' data-maxpercents="' . $arr['height_max_percents'] . '"';
		$return_str .= ' data-widthpercents="' . $arr['width_percents']  . '"';
	}

	$return_str .= ' data-color="';

	$return_str .= $arr['opener_color'] . '"';

	if ( 'false' !== $arr['ratio'] ) {
		// If wrong statement, it will be "parent" forcedly
		if ( 'window' === $arr['ratio'] ) {
			$return_str .= ' data-choice="window"';
		} else {
			$return_str .= ' data-choice="parent"';
		}
	}

	$return_str .= '>' . "\r\n";

	$return_str .= $content_text . "\r\n";

	if ( 'true' === $arr['opener_choice'] ) {
		$return_str .=	"\t\t" . '<div id="' . $id_opener . '" class="jimmy-branding-opener" style="font-size: ' . $arr['opener_width'] . 'px;border-top: 0.9em solid ' . $arr['opener_color'] . ';">' . "\r\n";
		$return_str .=	"\t\t\t" . '<span class="screen-reader-text">' . "\r\n";
		$return_str .=	"\t\t\t\t" . 'Expand Branding' . "\r\n";
		$return_str .=	"\t\t\t" . '</span>' . "\r\n";
		$return_str .= "\t\t" . '</div>' . "\r\n";
	}

	$return_str .= "\t" . '</div>' . "\r\n";

	$return_str .= '</div><!-- .jimmy-branding-wrap -->' . "\r\n";

	$return_str .= '<script type="text/javascript" defer>' . "\r\n";

	$return_str .= "\t" . 'JIMMY_BRANDING.windowOpener( "' . $id_content .
						'", "' . $id_opener .
						'" );' . "\r\n";

	$return_str .= '</script>' . "\r\n";

	return $return_str;
}

if ( 'use' === get_option( 'jimmy_branding_option_shortcode_choice' ) ) {
	add_shortcode( 'jimmy_branding', 'jimmy_branding_shortcode_jimmy_branding' );
}
