<article class="postie-<?= $attributes['display']; ?>-item postie-<?= $attributes['display']; ?>-<?= get_post_type(); ?> swiper-slide">
	<h3><?php the_title(); ?></h4>
	<?php the_excerpt(); ?>
	<?php the_post_thumbnail(); ?>
</article>
