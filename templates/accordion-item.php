<article class="postie-accordion-item postie-accordion-<?= get_post_type(); ?>">
	<h3 class="postie-accordion-title">
		<button type="button" id="<?= "{$id}-label"; ?>" class="postie-accordion-toggle" aria-controls="<?= $id; ?>" aria-expanded="false">
			<?php the_title(); ?>
		</button>
	</h3>
	<div id="<?= $id; ?>" class="postie-accordion-content" aria-labelledby="<?= "{$id}-label"; ?>" role="region">
		<?php the_excerpt(); ?>
	</div>
</article>
