/**
 * Internal dependencies
 */
import type { State } from '../../config';

type GetPageAttribute = typeof _getPageAttribute & {
	CurriedSignature: < Page extends keyof State[ 'meta' ][ 'pages' ] >(
		page: Page
	) => State[ 'meta' ][ 'pages' ][ Page ];
};
export const getPageAttribute = _getPageAttribute as GetPageAttribute;
function _getPageAttribute< Page extends keyof State[ 'meta' ][ 'pages' ] >(
	state: State,
	page: Page
): State[ 'meta' ][ 'pages' ][ Page ] {
	return state.meta.pages[ page ];
} //end _getPageAttribute()
