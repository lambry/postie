import { __ } from '@wordpress/i18n'
import { grid, flipHorizontal, plus } from "@wordpress/icons";

export default [
	{
		name: 'grid',
        isDefault: true,
        title: __('Post Grid', 'postie'),
        description: __('Display posts in a Grid', 'postie'),
        icon: grid,
        attributes: { display: 'grid' },
	}, {
		name: 'slider',
        isDefault: false,
        title: __('Post Slider', 'postie'),
        description: __('Display posts in a Slider', 'postie'),
        icon: flipHorizontal,
        attributes: { display: 'slider' },
	}, {
		name: 'accordion',
        isDefault: false,
        title: __('Post Accordion', 'postie'),
        description: __('Display posts in Accordions', 'postie'),
        icon: plus,
        attributes: {
			display: 'accordion',
			columnsMedium: 1,
			columnsLarge: 1
		},
	}
]
