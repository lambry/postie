import apiFetch from '@wordpress/api-fetch'

const api = '/renderless/'

export function get(endpoint) {
	return apiFetch({ path: api + endpoint })
}
