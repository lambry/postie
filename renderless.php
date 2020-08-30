<?php
/**
 * Plugin Name: Renderless
 * Plugin URI: https://github.com/lambry/renderless/
 * Description: A renderless WordPress posts block.
 * Version: 0.1.0
 * Author: Lambry
 * Author URI: https://lambry.com/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: renderless
 *
 * @package Renderless
 */

namespace Lambry\Renderless;

class Init
{
	/**
     * Setup actions.
     */
    public function __construct()
    {
		add_action('init', [$this, 'block']);
		add_action('rest_api_init', [$this, 'endpoints']);
	}

	/**
	 * Register block and assets.
	 */
	public function block()
	{
		$asset = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

		wp_register_script('renderless-script', plugins_url('build/index.js', __FILE__), $asset['dependencies'], $asset['version']);

		register_block_type('lambry/renderless', [
			'attributes' => $this->attributes(),
			'editor_script' => 'renderless-script',
			'render_callback' => [$this, 'render']
		]);
	}

	/**
	 * Get all attributes.
	 */
	private function attributes() : array
	{
		$attrs = file_get_contents(plugins_url('src/attrs.json', __FILE__));

		return array_merge([
			'align' => [
				'type' => 'string',
			],
			'className' => [
				'type' => 'string',
				'default' => ''
			]
		], json_decode($attrs, true));
	}

	/**
	 * Get posts and pass off block rendering.
	 */
	public function render(array $attributes) : string
	{
		if (isset($attributes['align'])) {
			$attributes['className'] .= " align{$attributes['align']}";
		}

		ob_start();

		do_action('renderless/html', $this->posts($attributes), $attributes);

		return ob_get_clean();
	}

	/**
	 * Get the relevant posts.
	 */
	public function posts(array $attrs) : array
	{
		$args = [
			'post_status' => 'publish',
			'post_type' => sanitize_text_field($attrs['type']),
			'posts_per_page' => sanitize_text_field($attrs['number']),
			'orderby' => sanitize_text_field($attrs['order']),
			'order' => sanitize_text_field($attrs['sort'])
		];

		if ($attrs['taxonomy'] && $attrs['term']) {
			$args['tax_query'] = [[
				'field' => 'id',
				'taxonomy' => sanitize_text_field($attrs['taxonomy']),
				'terms' => array_map('sanitize_text_field', $attrs['term'])
			]];
		}

		return get_posts(apply_filters('renderless/query', $args));
	}

	/**
	 * Setup endpoints.
	 */
	public function endpoints() : void
	{
		register_rest_route('renderless', '/taxonomies/(?P<type>[\w-]+)', [
			'methods'  => \WP_REST_Server::READABLE,
			'callback' => [$this, 'taxonomies']
		]);

		register_rest_route('renderless', '/terms/(?P<taxonomy>[\w-]+)', [
			'methods'  => \WP_REST_Server::READABLE,
			'callback' => [$this, 'terms']
		]);
	}

	/**
	 * Get all taxonomies.
	 */
	public function taxonomies(\WP_REST_Request $request) : array
	{
		$taxonomies = get_object_taxonomies(sanitize_text_field($request['type']), 'objects');

		if (! $taxonomies) return [];

		return array_map(fn($tax) => ['label' => $tax->label, 'value' => $tax->name], array_values($taxonomies));
	}

	/**
	 * Get all terms.
	 */
	public function terms(\WP_REST_Request $request) : array
	{
		$terms = get_terms(['taxonomy' => sanitize_text_field($request['taxonomy'])]);

		if (is_wp_error($terms)) return [];

		return array_map(fn($term) => ['id' => $term->term_id, 'value' => $term->name], array_values($terms));
	}
}

new Init();
