import { __ } from '@wordpress/i18n'

export const orderOptions = [
	{ value: 'ID', label: __('ID', 'renderless') },
	{ value: 'date', label: __('Publish Date', 'renderless') },
	{ value: 'modified', label: __('Modified Date', 'renderless') },
	{ value: 'title', label: __('Title', 'renderless') },
	{ value: 'name', label: __('Slug', 'renderless') },
	{ value: 'menu_order', label: __('Menu Order', 'renderless') },
	{ value: 'rand', label: __('Random', 'renderless') }
];

export const sortOptions = [
	{ value: 'ASC', label: __('Ascending', 'renderless') },
	{ value: 'DESC', label: __('Descending', 'renderless') }
];
