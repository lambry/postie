import { __ } from '@wordpress/i18n'
import { registerBlockType } from '@wordpress/blocks'
import icon from './icon'
import edit from './edit'
import attrs from './attrs.json'

registerBlockType('lambry/renderless', {
    icon,
    title: __('Posts', 'renderless'),
    description: __('Display posts, pages and custom post types.', 'renderless'),
	attributes: attrs,
	category: 'widgets',
	supports: {
		align: true,
		html: false
	},
    edit,
    save: () => null
})
