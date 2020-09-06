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
export function query(attributes) {
	return new URLSearchParams(attributes).toString()
}
