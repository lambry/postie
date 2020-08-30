# Renderless

In short, this plugin just adds the admin UI (or block) for creating and managing post blocks, the actual display is up to you. 

![screenshot](screenshot.jpg)


## Why?
Deferring the display of content means you have complete control over the markup, styles and functionality; no fiddling with settings or overriding plugin styles, you craft the display to suit your needs. 

Also, your data needs may be unique, you may want more than just the featured image, title and excerpt. If you're showing latest properties you may need to display data like `price`, `location` and `features`, or if you're displaying events you may want to show `venue`, `time`, and `tickets`.

## How.
Just provide the desired HTML and style the output the same way as you would any other part of your theme. This way you'll always have the cleanest markup and CSS for your needs.

```php
<?php

/**
 * Action to generate the blocks html.
 */
add_action('renderless/html', function($posts, $attrs) {
    get_template_part('cards');
}, 10, 2);

/**
 * Filter to optionally modify the main query args.
 */
add_filter('renderless/query', function($args) {
    return array_merge($args, ['author_name' => 'admin']);
});

```

### Notes
Renderless requires `PHP 7.4+`.