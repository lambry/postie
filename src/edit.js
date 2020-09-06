import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import ServerSideRender from '@wordpress/server-side-render'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, SelectControl, FormTokenField, RangeControl } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { orderOptions, sortOptions } from './options'
import { get, query } from './api'
import attrs from './attrs.json'

export default function Edit({ attributes, setAttributes }) {
	const { number, columns, type, taxonomy, term, order, meta, sort } = attributes

	const types = useSelect(select => select('core').getPostTypes()) || []
	let [taxonomies, setTaxonomies] = useState([])
	let [terms, setTerms] = useState([])
	let [fields, setFields] = useState([])

	useEffect(() => {
		if (type) get(`taxonomies/${type}`).then(setTaxonomies)
		if (taxonomy) get(`terms/${taxonomy}`).then(setTerms)
		if (order === 'meta') get(`meta/?${query(attributes)}`).then(setFields)
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

	const updateOrder = order => {
		setAttributes({ order })

		if (order === 'meta') {
			get(`meta/?${query(attributes)}`).then(setFields)
		} else {
			setAttributes({ meta: attrs.meta.default })
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
                </PanelBody>
                <PanelBody title={__('Order', 'postie')}>
					<SelectControl
						label={__('Order By', 'postie')}
						value={order}
						options={orderOptions}
						onChange={order => updateOrder(order)}
					/>
					{order === 'meta' && <SelectControl
						label={__('Select Field', 'postie')}
						value={meta}
						options={fields}
						onChange={meta => setAttributes({ meta })}
					/>}
					{order !== 'rand' && <SelectControl
						label={__('Sort Order', 'postie')}
						value={sort}
						options={sortOptions}
						onChange={sort => setAttributes({ sort })}
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
