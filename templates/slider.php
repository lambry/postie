<?php if ($query->have_posts()) : ?>
	<section class="postie postie-<?= $attributes['display']; ?> <?= $attributes['className']; ?>" data-columns-small="<?= $attributes['columnsSmall']; ?>" data-columns-medium="<?= $attributes['columnsMedium']; ?>" data-columns-large="<?= $attributes['columnsLarge']; ?>" data-auto-play="<?= $attributes['autoPlay']; ?>" data-loop-slides="<?= $attributes['loopSlides']; ?>" data-fade-slides="<?= $attributes['fadeSlides']; ?>">
		<div class="swiper">
			<div class="swiper-wrapper">
				<?php while ($query->have_posts()) : $query->the_post(); ?>
					<?php do_action('postie_item', 'slider'); ?>
				<?php endwhile; ?>
			</div>
		</div>

		<?php if ($attributes['pagination']) : ?>
			<div class="postie-<?= $attributes['display']; ?>-pagination swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
				<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>
				<span class="swiper-pagination-bullet"></span>
			</div>
		<?php endif; ?>

		<?php if ($attributes['navigation']) : ?>
			<button type="button" class="postie-<?= $attributes['display']; ?>-button-prev swiper-button-prev"></button>
			<button type="button" class="postie-<?= $attributes['display']; ?>-button-next swiper-button-next"></button>
		<?php endif; ?>
	</section>
<?php else : ?>
	<?= apply_filters('postie/empty', __('No results found', 'postie'), $attributes['display']); ?>
<?php endif;
