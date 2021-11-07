import Swiper, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";

// configure Swiper to use modules
Swiper.use([EffectFade, Autoplay, Navigation, Pagination]);

(function () {
	const sliders = document.querySelectorAll(".postie-slider");

	const getProp = (el, name) => parseInt(getComputedStyle(el).getPropertyValue(`--postie-slider-${name}`));

	[...sliders].forEach((item, i) => {
		const { columnsSmall, columnsMedium, columnsLarge, autoPlay, loopSlides, fadeSlides } = item.dataset;

		item.classList.add(`postie-slider-${i}`);

		new Swiper(item.querySelector('.swiper'), {
			effect: fadeSlides ? 'fade' : 'slide',
			fadeEffect: { crossFade: true },
			loop: loopSlides,
			speed: getProp(item, 'speed'),
			spaceBetween: getProp(item, 'gap'),
			autoplay: Number(autoPlay) ? {
				delay: autoPlay * 1000,
				pauseOnMouseEnter: true,
			} : false,
			pagination: {
				clickable: true,
				el: `.postie-slider-${i} .postie-slider-pagination`,
			},
			navigation: {
				nextEl: `.postie-slider-${i} .postie-slider-button-next`,
				prevEl: `.postie-slider-${i} .postie-slider-button-prev`,
			},
			slidesPerView: columnsSmall,
			breakpoints: {
				660: {
					slidesPerView: columnsMedium,
				},
				980: {
					slidesPerView: columnsLarge,
				},
			},
		});
	});
})();
