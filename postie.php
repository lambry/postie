<?php
/**
 * Plugin Name: Postie
 * Plugin URI: https://github.com/lambry/postie/
 * Description: A WordPress block for fetching posts, pages and custom post types.
 * Version: 0.1.2
 * Author: Lambry
 * Author URI: https://lambry.com/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: postie
 */

namespace Lambry\Postie;

class Init
{
	public $comparators = [
		'is' => '=', 'not' => '!=', 'lt' => '<', 'gt' => '>', 'lte' => '<=', 'gte' => '>='
	];

	/**
     * Setup actions and filters.
     */
    public function __construct()
    {
		add_action('init', [$this, 'block']);
		add_action('rest_api_init', [$this, 'endpoints']);
		add_filter('site_transient_update_plugins', [$this, 'updates']);
	}

	/**
	 * Register block and assets.
	 */
	public function block()
	{
		$asset = include plugin_dir_path(__FILE__) . 'build/index.asset.php';

		wp_register_script('postie-script', plugins_url('build/index.js', __FILE__), $asset['dependencies'], $asset['version']);

		register_block_type('lambry/postie', [
			'attributes' => $this->attributes(),
			'editor_script' => 'postie-script',
			'render_callback' => [$this, 'render']
		]);
	}

	/**
	 * Setup endpoints.
	 */
	public function endpoints() : void
	{
		register_rest_route('postie', '/pages', [
			'methods'  => \WP_REST_Server::READABLE,
			'permission_callback' => fn() => current_user_can('edit_posts'),
			'callback' => [$this, 'pages']
		]);

		register_rest_route('postie', '/taxonomies/(?P<type>[\w-]+)', [
			'methods'  => \WP_REST_Server::READABLE,
			'sanitize_callback' => 'sanitize_text_field',
			'permission_callback' => fn() => current_user_can('edit_posts'),
			'callback' => [$this, 'taxonomies']
		]);

		register_rest_route('postie', '/terms/(?P<taxonomy>[\w-]+)', [
			'methods'  => \WP_REST_Server::READABLE,
			'sanitize_callback' => 'sanitize_text_field',
			'permission_callback' => fn() => current_user_can('edit_posts'),
			'callback' => [$this, 'terms']
		]);

		register_rest_route('postie', '/fields', [
			'methods'  => \WP_REST_Server::READABLE,
			'permission_callback' => fn() => current_user_can('edit_posts'),
			'callback' => [$this, 'fields']
		]);
	}

	/**
	 * Remove update notifications as this plugin isn't managed
	 * via the WordPress plugins repo, and the name already exists.
	 */
	function updates($updates)
	{
		unset($updates->response[plugin_basename(__FILE__)]);

		return $updates;
	}

	/**
	 * Get all attributes.
	 */
	private function attributes() : array
	{
		$attrs = file_get_contents(plugins_url('src/attrs.json', __FILE__));

		return array_merge([
			'align' => [ 'type' => 'string', ],
			'className' => [ 'type' => 'string', 'default' => '' ]
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

		do_action('postie/html', $this->posts($attributes), $attributes);

		return ob_get_clean();
	}

	/**
	 * Get the relevant posts.
	 */
	public function posts(array $attrs) : \WP_Query
	{
		$args = [
			'post_status' => 'publish',
			'ignore_sticky_posts' => ! rest_sanitize_boolean($attrs['sticky']),
			'post_type' => sanitize_text_field($attrs['type']),
			'posts_per_page' => sanitize_text_field($attrs['number']),
			'orderby' => sanitize_text_field($attrs['orderBy']),
			'order' => sanitize_text_field($attrs['order'])
		];

		if ($attrs['page']) {
			$args[($attrs['pageChildren'] ? 'post_parent__in' : 'post__in')] = array_map('sanitize_text_field', (array) $attrs['page']);
		}

		if ($attrs['taxonomy'] && $attrs['term']) {
			$args['tax_query'] = [[
				'field' => 'id',
				'taxonomy' => sanitize_text_field($attrs['taxonomy']),
				'terms' => array_map('sanitize_text_field', (array) $attrs['term'])
			]];
		}

		if ($attrs['filter'] && $attrs['filterBy'] && $attrs['filterValue']) {
			[$key, $type] = explode('::', sanitize_text_field($attrs['filterBy']));
			$value = sanitize_text_field($attrs['filterValue']);

			$args['meta_query'] = [[
				'key' => $key,
				'value' => is_numeric($value) ? (int) $value : $value,
				'type' => is_numeric($value) ? 'NUMERIC' : 'CHAR',
				'compare' => $this->comparators[$attrs['filterType']]
			]];
		}

		if ($attrs['orderMeta']) {
			[$key, $type] = explode('::', sanitize_text_field($attrs['orderMeta']));

			$args['meta_key'] = $key;
			$args['orderby'] = $type === 'int' ? 'meta_value_num' : 'meta_value';
		}

		return new \WP_Query(apply_filters('postie/query', $args));
	}

	/**
	 * Get all pages.
	 */
	public function pages(\WP_REST_Request $request) : array
	{
		$pages = get_pages();

		if (! $pages) return [];

		return array_map(fn($page) => ['id' => $page->ID, 'value' => $page->post_title], array_values($pages));
	}

	/**
	 * Get all taxonomies.
	 */
	public function taxonomies(\WP_REST_Request $request) : array
	{
		$taxonomies = get_object_taxonomies($request['type'], 'objects');

		if (! $taxonomies) return [];

		return array_map(fn($tax) => ['label' => $tax->label, 'value' => $tax->name], array_values($taxonomies));
	}

	/**
	 * Get all terms.
	 */
	public function terms(\WP_REST_Request $request) : array
	{
		$terms = get_terms(['taxonomy' => $request['taxonomy']]);

		if (is_wp_error($terms)) return [];

		return array_map(fn($term) => ['id' => $term->term_id, 'value' => $term->name], array_values($terms));
	}

	/**
	 * Get all relevant custom fields, i.e. meta keys and types.
	 */
	public function fields(\WP_REST_Request $request) : array
	{
		$query = $this->posts($request->get_params());

		if (! $query->have_posts()) return [];

		$id = $query->posts[0]->ID;
		$keys = get_post_custom_keys($id) ?: [];
		$fields = array_values(array_diff($keys, ['_edit_lock', '_edit_last', '_thumbnail_id']));

		return array_map(function($field) use ($id) {
			$meta = get_post_meta($id, $field, true);
			$type = $meta && is_numeric($meta) ? 'int' : 'string';

			return [
				'value' => "{$field}::{$type}",
				'label' => ucfirst(trim(str_replace('_', ' ', $field)))
			];
		}, $fields);
	}
}

new Init();
