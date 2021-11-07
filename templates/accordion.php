<?php if ($query->have_posts()) : ?>
	<section class="postie postie-<?= $attributes['display']; ?> postie-cols-small-<?= $attributes['columnsSmall']; ?> postie-cols-medium-<?= $attributes['columnsMedium']; ?> postie-cols-large-<?= $attributes['columnsLarge']; ?> <?= $attributes['className']; ?>" data-open-first="<?= $attributes['openFirst']; ?>" data-open-individually="<?= $attributes['openIndividually']; ?>">
		<?php while ($query->have_posts()) : $query->the_post(); ?>
			<?php do_action('postie_item', 'accordion'); ?>
		<?php endwhile; ?>
	</section>
<?php else : ?>
	<?= apply_filters('postie/empty', __('No results found', 'postie'), $attributes['display']); ?>
<?php endif;
