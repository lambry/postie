import { __ } from '@wordpress/i18n'
import { registerBlockType } from '@wordpress/blocks'
import { grid } from "@wordpress/icons";
import edit from './block/edit'
import attributes from './block/attributes.json'
import variations from './block/variations'
import './style.scss';

registerBlockType('lambry/postie', {
    icon: grid,
    title: __('Postie', 'postie'),
    description: __('Post grids, sliders and accordions.', 'postie'),
	category: 'widgets',
	attributes,
	variations,
	supports: {
		align: true,
		html: false
	},
    edit,
    save: () => null
})
