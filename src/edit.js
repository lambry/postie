import { __ } from '@wordpress/i18n'
import { useSelect } from '@wordpress/data'
import ServerSideRender from '@wordpress/server-side-render'
import { InspectorControls } from '@wordpress/block-editor'
import { PanelBody, SelectControl, FormTokenField, RangeControl } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'
import { orderOptions, sortOptions } from './options'
import { get } from './api'
import attrs from './attrs.json'

export default function Edit({ attributes, setAttributes, className }) {
	const { type, taxonomy, term, number, columns, order, sort } = attributes

	const types = useSelect(select => select('core').getPostTypes()) || []
	let [taxonomies, setTaxonomies] = useState([])
	let [terms, setTerms] = useState([])

	useEffect(() => {
		if (type) get(`taxonomies/${type}`).then(setTaxonomies)
		if (taxonomy) get(`terms/${taxonomy}`).then(setTerms)
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

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Source', 'renderless')}>
					<SelectControl
						label={__('Post Type', 'renderless')}
						value={type}
						options={types.map(({ name, slug }) => ({ label: name, value: slug }))}
						onChange={type => updateType(type)}
					/>
					{(type && !!taxonomies.length) &&
						<SelectControl
							label={__('Taxonomy', 'renderless')}
							value={taxonomy}
							options={[{ label: __('Select taxonomy'), value: '' }, ...taxonomies]}
							onChange={taxonomy => updateTaxonomy(taxonomy)}
						/>
					}
					{(taxonomy && !!terms.length) &&
						<FormTokenField
							label={__('Terms', 'renderless')}
							value={term.map(id => ({ id, value: terms.find(t => t.id === id)?.value }))}
							suggestions={terms.map(i => i.value)}
							onChange={term => updateTerm(term)}
						/>
					}
                </PanelBody>
                <PanelBody title={__('Display', 'renderless')}>
					<RangeControl
						min={1}
						max={100}
						label={__('Number', 'renderless')}
						value={number}
						onChange={number => setAttributes({ number })}
					/>
					<RangeControl
						min={1}
						max={6}
						label={__('Columns', 'renderless')}
						value={columns}
						onChange={columns => setAttributes({ columns })}
					/>
					<SelectControl
						label={__('Order By', 'renderless')}
						value={order}
						options={orderOptions}
						onChange={order => setAttributes({ order })}
					/>
					{order !== 'rand' && <SelectControl
						label={__('Sort Order', 'renderless')}
						value={sort}
						options={sortOptions}
						onChange={sort => setAttributes({ sort })}
					/>}
                </PanelBody>
            </InspectorControls>
			<section className={`renderless ${className}`}>
				<ServerSideRender
					block="lambry/renderless"
					attributes={attributes}
				/>
			</section>
        </>
    )
}
