/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { map, uniq, trim } from 'lodash';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isUrl } from './branded-types';
import { isEmpty } from './validators';

// NOTE. Dependency loop with @nelio-content/data.
import type { store } from '@nelio-content/data';
const NC_DATA = 'nelio-content/data' as unknown as typeof store;

/**
 * Extracts all URLs from the content.
 *
 * @param {string} content the content from which to extract urls.
 *
 * @return {Array} list of URLs.
 */
export function getAllUrls( content: string ): ReadonlyArray< Url > {
	content = ` ${ content } `;
	content = content.replace( /\s/g, '  ' );
	return map( content.match( /\shttps?:\/\/[^\s]+\s/g ), trim ).filter(
		isUrl
	);
} //end getAllUrls()

/**
 * Extracts all links from the content.
 *
 * A link is a URL that appears in an `href` attribute.
 *
 * @param {string} content the content from which to extract the links.
 *
 * @return {Array} list of links.
 */
export function getLinks( content = '' ): ReadonlyArray< string > {
	const matches = content.match( /href="[^"]+"|href='[^']+'/gi ) || [];
	const links = map( matches, ( match ) =>
		match.substring( 6, match.length - 1 )
	);
	return uniq( links );
} //end getLinks()

/**
 * Whether the given URL is internal or not.
 *
 * @param {string} url a URL.
 *
 * @return {boolean} whether the given URL is internal or not.
 */
export function isInternalUrl( url: string ): boolean {
	const functions = select( NC_DATA );
	if ( ! functions ) {
		return false;
	} //end if

	const { getHomeUrl } = functions;
	const homeUrl = getHomeUrl();
	if ( isEmpty( homeUrl ) ) {
		return false;
	} //end if

	if ( ! /[a-z]:\/\//.test( url ) ) {
		return true;
	} //end if

	return 0 === url.indexOf( homeUrl );
} //end isInternalUrl()

/**
 * Whether the given URL is external or not.
 *
 * @param {string} url a URL.
 *
 * @return {boolean} whether the given URL is external or not.
 */
export function isExternalUrl( url: string ): boolean {
	const functions = select( NC_DATA );
	if ( ! functions ) {
		return false;
	} //end if

	const { getNonReferenceDomainRegexes } = functions;
	try {
		const nonReferenceRegexes = getNonReferenceDomainRegexes();
		for ( const nonReference of nonReferenceRegexes ) {
			try {
				if ( nonReference.test( url ) ) {
					return false;
				} //end if
			} catch ( _ ) {}
		} //end for
	} catch ( _ ) {}

	return ! isInternalUrl( url );
} //end isExternalUrl()
