import { __ } from '@wordpress/i18n'
import { registerBlockType } from '@wordpress/blocks'
import icon from './icon'
import edit from './edit'
import attrs from './attrs.json'

registerBlockType('lambry/postie', {
    icon,
    title: __('Postie', 'postie'),
    description: __('Posts, pages and custom types.', 'postie'),
	attributes: attrs,
	category: 'widgets',
	supports: {
		align: true,
		html: false
	},
    edit,
    save: () => null
})
