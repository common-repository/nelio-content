/**
 * WordPress dependencies.
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import latinize from 'latinize';
import { reverse, startCase } from 'lodash';
import { getSettings } from '@nelio-content/date';

const DIV = document.createElement( 'div' );

export function pascalCase( s: string ): string {
	return startCase( s ).replaceAll( ' ', '' );
} //end pascalCase()

export function getFirstLatinizedLetter( value: string ): string {
	value = !! value ? `${ value }` : '';
	return (
		latinize( value.toLowerCase() )
			.replace( /[^a-z]/g, '' )
			.charAt( 0 ) || 'a'
	);
} //end getFirstLatinizedLetter()

export function decodeHtmlEntities( value: string ): string {
	DIV.innerHTML = value.replace( /</g, '&lt;' );
	return DIV.textContent ?? '';
} //end decodeHtmlEntities()

export function getLocale(): string {
	const settings = getSettings();
	return settings.l10n.locale || '';
} //end getLocale()

export function getShortLocale(): string {
	return getLocale().substring( 0, 2 );
} //end getShortLocale()

// eslint-disable-next-line @wordpress/i18n-no-flanking-whitespace
const AND = _x( ' and ', 'text (2 item list)', 'nelio-content' );
// eslint-disable-next-line @wordpress/i18n-no-flanking-whitespace
const AND_PLUS = _x( ', and ', 'text (2+ item list)', 'nelio-content' );
// eslint-disable-next-line @wordpress/i18n-no-flanking-whitespace
const OR = _x( ' or ', 'text (2 item list)', 'nelio-content' );
// eslint-disable-next-line @wordpress/i18n-no-flanking-whitespace
const OR_PLUS = _x( ', or ', 'text (2+ item list)', 'nelio-content' );

export function listify(
	mode: 'and' | 'or',
	tokens: ReadonlyArray< string >
): string {
	if ( ! tokens.length ) {
		return '';
	} //end if

	if ( tokens.length === 1 ) {
		return tokens[ 0 ] ?? '';
	} //end if

	const andor = (): string => {
		if ( 'and' === mode ) {
			return tokens.length === 2 ? AND : AND_PLUS;
		}
		return tokens.length === 2 ? OR : OR_PLUS;
		//end if
	};

	const [ z = '', y = '', ...x ] = reverse( tokens );
	return [ ...reverse( x ), `${ y }${ andor() }${ z }` ].join( ', ' );
} //end listify()
