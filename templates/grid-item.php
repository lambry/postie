<article class="postie-grid-item postie-grid-<?= get_post_type(); ?>">
	<?php the_post_thumbnail(); ?>
	<h3><?php the_title(); ?></h3>
	<?php the_excerpt(); ?>
</article>
