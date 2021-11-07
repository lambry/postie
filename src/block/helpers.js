import apiFetch from '@wordpress/api-fetch'

/**
 * Get data from endpoint.
 */
export function get(endpoint) {
	return apiFetch({ path: `/postie/${endpoint}` })
}

/**
 * Generate query string.
 */
export function query(attributes = {}) {
	return new URLSearchParams(attributes).toString()
}

/**
 * Get unique objects from array.
 */
export function unique(items) {
	return [...new Set(items.map(item => JSON.stringify(item)))].map(item => JSON.parse(item))
}

/**
 * Debounce function calls.
 */
export function debounce(callback, wait = 250) {
	let timeoutId = null

	return (...args) => {
		clearTimeout(timeoutId)

		timeoutId = setTimeout(() => callback(args), wait)
	}
}

/**
 * Get a single options from the supplied options.
 */
export function tokenOption(value, options = []) {
	return options.find(option => option.label === value)
}

/**
 * Get an array of tokens values from the supplied options.
 *
 * Note: Values is an array of displayed values i.e. labels.
 */
export function tokenValues(values = [], options = []) {
	const tokens = values.map(value => {
		const token = options.find(option => option.label === value)

		return token?.value || false
	})

	return tokens.filter(Boolean)
}

/**
 * Get an array token labels from the supplied options.
 *
 * Note: Values is an array of saved values i.e. values/ids.
 */
export function tokenLabels(values = [], options = []) {
	const tokens = values.map(value => {
		const token = options.find(option => option.value === value)

		return token?.label || false
	})

	return tokens.filter(Boolean)
}

/**
 * Get an array of token suggestions from the supplied values.
 * i.e. the actual text to display as the suggestion.
 */
export function tokenSuggestions(values = []) {
	return values.map(({ label }) => label)
}
