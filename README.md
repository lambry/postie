# Postie

A WordPress block for fetching posts, pages and custom post types and displaying them as a `grid`, `slider` or `accordion`. 

![screenshot](screenshot.jpg)

## Features
- Fetch any posts, pages and custom post types.
- Filter by any taxonomies, terms and custom fields.
- Choose specific pages, or show all subpages for said pages.
- Order by ID, date, modified date, title, slug, menu order, random or custom field.

With postie you can fetch; fantasy books that are less than $20 sorted by price, or properties that feature waterfront views, have 3 or more bedroom and are sorted by land size.

### Templates

You can override any aspect of the display by creating templates in `my-theme-name/postie/` the basic template heirarchy is:
- `grid.php`, `slider.php` and `accordion.php` will override the main template/wrapper for those display types.
- `grid-item.php`, `slider-item.php` and `accordion-item.php` will override the template/display individual posts within those display types.
- `grid-{post-type}.php`, `slider-{post-type}.php` and `accordion-{post-type}.php` will override the default template for individual posts within those display types, for example `grid-post.php` will override `grid-item.php` for posts and `slider-page.php` would override `slider-item.php` for pages.

### Filters

```php
<?php
/**
 * Filter to modify the main query arguments.
 */
add_filter('postie/query', function(array $args) {
    return array_merge($args, ['author_name' => 'admin']);
});

/**
 * Filter to set the no results i.e empty message.
 */
add_filter('postie/empty', function(string $message, string $display) {
    return __('Sorry, there were no matching results.');
}, 10, 2);
```

### Custom properties

Postie comes with little to no actually styling just what's need for the base layout, below are the available custom properties.

```css
:root {
	--postie-grid-gap: 2rem;
	--postie-slider-gap: 20px;
	--postie-slider-speed: 250;
	--postie-slider-theme: coral;
	--postie-accordion-gap: 1.5rem;
	--postie-accordion-speed: 0.5s;
	--postie-accordion-easing: cubic-bezier(0.46, 0.03, 0.52, 0.96);
}
```
Note: slider-gap must be set in pixels.
