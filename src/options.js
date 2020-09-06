import { __ } from '@wordpress/i18n'

export const orderOptions = [
	{ value: 'ID', label: __('ID', 'postie') },
	{ value: 'date', label: __('Publish Date', 'postie') },
	{ value: 'modified', label: __('Modified Date', 'postie') },
	{ value: 'title', label: __('Title', 'postie') },
	{ value: 'name', label: __('Slug', 'postie') },
	{ value: 'menu_order', label: __('Menu Order', 'postie') },
	{ value: 'rand', label: __('Random', 'postie') },
	{ value: 'meta', label: __('Custom Field', 'postie') },
];

export const sortOptions = [
	{ value: 'ASC', label: __('Ascending', 'postie') },
	{ value: 'DESC', label: __('Descending', 'postie') }
];
