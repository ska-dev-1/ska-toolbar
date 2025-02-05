<?php
/**
 * Plugin Name: ska-toolbar
 * Description: Adds a toolbar with quick actions to the Block Editor.
 * Author: skadev
 * Author URI: https://profiles.wordpress.org/skadev/
 * License: GPLv2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: ska-toolbar
 * Version: 1.0.0
 */

namespace ska\toolbar;

defined('ABSPATH') || exit;

function_exists('get_plugin_data') || require_once ABSPATH . 'wp-admin/includes/plugin.php';
$ska_toolbar_plugin = get_plugin_data(__FILE__, false, false);
define('SKA_TOOLBAR_VER', $ska_toolbar_plugin['Version']);
define('SKA_TOOLBAR_FILE', __FILE__);
define('SKA_TOOLBAR_DIR', dirname(__FILE__));

/**
 * Enqueue editor assets.
 */
function editor_assets() {

	$asset = include SKA_TOOLBAR_DIR . '/build/index.asset.php';

	wp_enqueue_style(
		'ska-toolbar',
		plugins_url('build/style-index' . (is_rtl() ? '-rtl' : '') . '.css', SKA_TOOLBAR_FILE),
		[],
		$asset['version'],
		'all'
	);

	wp_enqueue_script(
		'ska-toolbar',
		plugins_url('build/index.js', SKA_TOOLBAR_FILE),
		$asset['dependencies'],
		$asset['version'],
		false
	);
}
add_action('enqueue_block_editor_assets', __NAMESPACE__ . '\\editor_assets');
