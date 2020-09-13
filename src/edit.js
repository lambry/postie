import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import ServerSideRender from '@wordpress/server-side-render'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, SelectControl, FormTokenField, RangeControl, ToggleControl, TextControl } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { filterTypes, orderOptions, orderByOptions } from './options'
import { get, query } from './api'
import attrs from './attrs.json'

export default function Edit({ attributes, setAttributes }) {
	const { number, columns, sticky, type, taxonomy, term, filter, filterBy, filterType, filterValue, order, orderBy, orderMeta } = attributes

	const types = useSelect(select => select('core').getPostTypes()) || []
	let [taxonomies, setTaxonomies] = useState([])
	let [terms, setTerms] = useState([])
	let [fields, setFields] = useState([])

	useEffect(() => {
		if (type) get(`taxonomies/${type}`).then(setTaxonomies)
		if (taxonomy) get(`terms/${taxonomy}`).then(setTerms)
		if (orderBy === 'meta' || filter) get(`fields/?${query(attributes)}`).then(setFields)
	}, [])

	const updateType = type => {
		setAttributes({ type, term: attrs.term.default, taxonomy: attrs.taxonomy.default })

		get(`taxonomies/${type}`).then(setTaxonomies)
	}

	const updateTaxonomy = taxonomy => {
		setAttributes({ taxonomy, term: attrs.term.default })

		if (!taxonomy) return setTerms([])

		get(`terms/${taxonomy}`).then(setTerms)
	}

	const updateTerm = term => setAttributes({
		term: term.map(s => terms.find(({ id, value }) => value === s || id === s.id)?.id)
	})

	const updateFilter = () => {
		if (!filter) {
			get(`fields/?${query(attributes)}`).then(setFields)
		}

		setAttributes({ filter: ! filter })
	}

	const updateFilterBy = filterBy => {
		setAttributes({ filterBy })

		if (filterBy.split('::')[1] === 'string' && ! ['is', 'not'].includes(filterType)) {
			setAttributes({ filterType: 'is' })
		}
	}

	const updateOrderBy = orderBy => {
		setAttributes({ orderBy })

		if (orderBy === 'meta') {
			get(`fields/?${query(attributes)}`).then(setFields)
		} else {
			setAttributes({ orderMeta: attrs.orderMeta.default })
		}
	}

    return (
        <>
            <InspectorControls>
				<PanelBody title={__('Display', 'postie')}>
					<RangeControl
						min={1}
						max={100}
						label={__('Number', 'postie')}
						value={number}
						onChange={number => setAttributes({ number })}
					/>
					<RangeControl
						min={1}
						max={6}
						label={__('Columns', 'postie')}
						value={columns}
						onChange={columns => setAttributes({ columns })}
					/>
					{type !== 'page' && <ToggleControl
						label={__('Include sticky posts', 'postie')}
						checked={sticky}
						onChange={() => setAttributes({ sticky: !sticky })}
					/>}
                </PanelBody>
                <PanelBody title={__('Source', 'postie')}>
					<SelectControl
						label={__('Post Type', 'postie')}
						value={type}
						options={types.map(({ name, slug }) => ({ label: name, value: slug }))}
						onChange={type => updateType(type)}
					/>
					{(type && !!taxonomies.length) &&
						<SelectControl
							label={__('Taxonomy', 'postie')}
							value={taxonomy}
							options={[{ label: __('Select taxonomy', 'postie'), value: '' }, ...taxonomies]}
							onChange={taxonomy => updateTaxonomy(taxonomy)}
						/>
					}
					{(taxonomy && !!terms.length) &&
						<FormTokenField
							label={__('Terms', 'postie')}
							value={term.map(id => ({ id, value: terms.find(t => t.id === id)?.value }))}
							suggestions={terms.map(i => i.value)}
							onChange={term => updateTerm(term)}
						/>
					}
					<ToggleControl
						label={__('Filter by custom field', 'postie')}
						checked={filter}
						onChange={() => updateFilter()}
					/>
					{filter && <SelectControl
						label={__('Custom Field', 'postie')}
						value={filterBy}
						options={[{ label: __('Select field', 'postie'), value: '' }, ...fields]}
						onChange={filterBy => updateFilterBy(filterBy)}
					/>}
					{(filter && filterBy) && <SelectControl
						label={__('Filter method', 'postie')}
						value={filterType}
						options={filterTypes.filter(({ value }) => {
							return filterBy.split('::')[1] === 'int' || ['is', 'not'].includes(value)
						})}
						onChange={filterType => setAttributes({ filterType })}
					/>}
					{(filter && filterBy) && <TextControl
						label={__('Filter Value', 'postie')}
						value={filterValue}
						onChange={filterValue => setAttributes({ filterValue })}
					/>}
                </PanelBody>
                <PanelBody title={__('Order', 'postie')}>
					<SelectControl
						label={__('Order By', 'postie')}
						value={orderBy}
						options={orderByOptions}
						onChange={orderBy => updateOrderBy(orderBy)}
					/>
					{orderBy === 'meta' && <SelectControl
						label={__('Custom Field', 'postie')}
						value={orderMeta}
						options={[{ label: __('Select field', 'postie'), value: '' }, ...fields]}
						onChange={orderMeta => setAttributes({ orderMeta })}
					/>}
					{orderBy !== 'rand' && <SelectControl
						label={__('Sort Order', 'postie')}
						value={order}
						options={orderOptions}
						onChange={order => setAttributes({ order })}
					/>}
                </PanelBody>
            </InspectorControls>
			<ServerSideRender
				block="lambry/postie"
				attributes={attributes}
			/>
        </>
    )
}
