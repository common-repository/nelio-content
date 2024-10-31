/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import hashtagfy from 'hashtagfy';
import moment from 'moment';
import { keys, mapValues, take, trim, values } from 'lodash';
import { make } from 'ts-brand';
import {
	getSettings as getDateSettings,
	date,
	dateI18n,
	format,
	wpifyDateTime,
} from '@nelio-content/date';
import { getMessageLength } from '@nelio-content/networks';
import type {
	CustomField,
	CustomKey,
	CustomPlaceholder,
	Dict,
	EditorialTask,
	Maybe,
	MetaKey,
	Post,
	SocialMessage,
} from '@nelio-content/types';

// NOTE. Dependency loop with @nelio-content/data.
import type { store } from '@nelio-content/data';
const NC_DATA = 'nelio-content/data' as unknown as typeof store;

export function extractDateTimeValues( datetime?: string | false ): Maybe< {
	readonly dateValue: string;
	readonly timeValue: string;
} > {
	if ( ! datetime ) {
		return;
	} //end if

	return {
		dateValue: date( 'Y-m-d', datetime ),
		timeValue: date( 'H:i', datetime ),
	};
} //end extractDateTimeValues()

export function getBaseDatetime(
	post: Maybe< Pick< Post, 'date' | 'status' > >,
	dateType: EditorialTask[ 'dateType' ]
): 'now' | 'none' | string {
	if ( 'exact' === dateType ) {
		return 'none';
	} //end if

	if ( ! post ) {
		return 'now';
	} //end if

	try {
		if ( 'publish' === post.status ) {
			return 'now';
		} else if ( post.date ) {
			return post.date;
		} //end if
	} catch ( _ ) {}

	return 'none';
} //end getBaseDatetime()

export function computeSocialMessageText(
	maxLength: number,
	post: Maybe< Post >,
	text = ''
): string {
	return computeText( text, maxLength, post );
} //end computeSocialMessageText()

export function getSocialMessageSchedule( {
	baseDatetime,
	dateValue,
	timeType,
	timeValue,
}: {
	readonly baseDatetime: Maybe< 'now' | string >;
} & Pick< SocialMessage, 'dateValue' | 'timeType' | 'timeValue' > ): string {
	if ( 'now' === baseDatetime ) {
		const { getUtcNow } = select( NC_DATA );
		baseDatetime = getUtcNow();
	} //end if

	if ( ! dateValue || ! timeValue ) {
		return baseDatetime ?? '';
	} //end if

	const schedule = moment( baseDatetime );
	if ( '0' === dateValue && /^[0-9]+$/.test( timeValue ) ) {
		schedule.add( Number.parseInt( timeValue ), 'hours' );
		return schedule.toISOString();
	} //end if

	if ( 'time-interval' === timeType ) {
		const timeValueMaps: Dict< string > = {
			morning: '08:00',
			noon: '11:00',
			afternoon: '15:00',
		};
		timeValue = timeValueMaps[ timeValue ] || '19:00';
	} //end if

	if ( /^[0-9]+$/.test( dateValue ) ) {
		schedule.add( Number.parseInt( dateValue ), 'days' );
		dateValue = format( 'Y-m-d', schedule );
	} //end if

	return wpifyDateTime( 'c', dateValue, timeValue );
} //end getSocialMessageSchedule()

export function getTaskDateDue( {
	baseDatetime,
	dateType,
	dateValue,
}: {
	readonly baseDatetime: Maybe< 'now' | string >;
} & Pick< EditorialTask, 'dateType' | 'dateValue' > ): string {
	if ( 'exact' === dateType ) {
		return wpifyDateTime( 'c', dateValue, '12:00' );
	} //end if

	if ( 'now' === baseDatetime ) {
		const { getUtcNow } = select( NC_DATA );
		baseDatetime = getUtcNow();
	} else if ( 'none' === baseDatetime || ! baseDatetime ) {
		baseDatetime = '';
	} //end if

	let dateValueNum = Number.parseInt( dateValue );
	dateValueNum = isNaN( dateValueNum ) ? 0 : dateValueNum;
	if ( 'negative-days' === dateType ) {
		dateValueNum = -dateValueNum;
	} //end if

	if ( baseDatetime ) {
		const d = moment( baseDatetime );
		d.add( dateValueNum, 'days' );
		return d.toISOString();
	} //end if

	return baseDatetime;
} //end getTaskDateDue()

export function getHumanDateDue(
	post: Maybe< Post >,
	dateType: EditorialTask[ 'dateType' ],
	dateValue: EditorialTask[ 'dateValue' ]
): string {
	const dateDue = getTaskDateDue( {
		baseDatetime: post?.date || '',
		dateType,
		dateValue,
	} );

	if ( dateDue ) {
		return dateI18n( getDateSettings().formats.date, dateDue );
	} //end if

	let dateValueNum = Number.parseInt( dateValue );
	dateValueNum = isNaN( dateValueNum ) ? 0 : dateValueNum;
	if ( 'negative-days' === dateType ) {
		dateValueNum = -dateValueNum;
	} //end if

	if ( dateValueNum < 0 ) {
		dateValueNum = Math.abs( dateValueNum );
		return sprintf(
			/* translators: number of days */
			_nx(
				'%d day before publication',
				'%d days before publication',
				dateValueNum,
				'text',
				'nelio-content'
			),
			dateValueNum
		);
	} //end if

	if ( 0 < dateValueNum ) {
		return sprintf(
			/* translators: number of days */
			_nx(
				'%d day after publication',
				'%d days after publication',
				dateValueNum,
				'text',
				'nelio-content'
			),
			dateValueNum
		);
	} //end if

	return _x( 'Publication day', 'text', 'nelio-content' );
} //end getHumanDateDue()

// =======
// HELPERS
// =======

function computeText( text: string, maxLength: number, post?: Post ) {
	if ( ! post ) {
		return clean( text );
	} //end if

	// Basic template
	let template = ` ${ text } `
		.replaceAll( '{permalink}', post.permalink )
		.replaceAll( '{title}', post.title )
		.replaceAll( '{author}', post.authorName )
		.replaceAll( '{excerpt}', post.excerpt )
		.replaceAll(
			'{categories}',
			'{taxonomy:category} {taxonomy:product_cat}'
		)
		.replaceAll( '{tags}', '{taxonomy:post_tag} {taxonomy:product_tag}' );

	template = replaceCustomFields( template, post.customFields );
	template = replaceCustomPlaceholders( template, post.customPlaceholders );
	template = replaceTaxonomies( template, post.taxonomies, maxLength );

	return cleanAllButPermalink( template );
} //end computeText()

function replaceTaxonomies(
	text: string,
	taxonomies: Post[ 'taxonomies' ],
	maxLength: number
) {
	const taxTerms = mapValues( taxonomies, ( terms ) =>
		terms.map( ( t ) => hashtagify( t.name ) )
	);

	const addTerms = ( count: number, value: string ) =>
		keys( taxTerms ).reduce(
			( result, tax ) =>
				result.replace(
					new RegExp( `{taxonomy:${ tax }}`, 'g' ),
					take( taxTerms[ tax ], count ).join( ' ' )
				),
			value
		);

	const maxTermCount = values( taxTerms ).reduce(
		( c, ts ) => Math.max( c, ts.length ),
		0
	);
	for ( let i = 1; i <= maxTermCount; ++i ) {
		const result = addTerms( i, text );
		if ( getMessageLength( result ) > maxLength ) {
			return addTerms( i - 1, text );
		} //end if
	} //end for

	return addTerms( maxTermCount, text );
} //end replaceTaxonomies()

function replaceCustomFields(
	text: string,
	customFields: Record< MetaKey, CustomField >
): string {
	const matches = Array.from( text.matchAll( /{field:([^}]*)}/g ) );
	return matches.reduce( ( r, [ p = '', n = '' ] ) => {
		const foundField = customFields[ make< MetaKey >()( n ) ];
		return p ? r.replaceAll( p, trim( foundField?.value ) ) : r;
	}, text );
} //end replaceCustomFields()

function replaceCustomPlaceholders(
	text: string,
	customPlaceholders: Record< CustomKey, CustomPlaceholder >
): string {
	const matches = Array.from( text.matchAll( /{custom:([^}]*)}/g ) );
	return matches.reduce( ( r, [ p = '', n = '' ] ) => {
		const foundPlaceholder = customPlaceholders[ make< CustomKey >()( n ) ];
		return p ? r.replaceAll( p, trim( foundPlaceholder?.value ) ) : r;
	}, text );
} //end replaceCustomPlaceholders()

const hashtagify = ( tag: string ) => {
	const hashtag = hashtagfy( tag );

	// More than one word joined.
	if (
		hashtag.split( '' ).filter( ( c ) => c !== c.toLowerCase() ).length > 1
	) {
		return hashtag;
	}

	// Lower case first character (after #) if only one word hashtag.
	return hashtag
		.split( '' )
		.map( ( c, i ) => ( i === 1 ? c.toLowerCase() : c ) )
		.join( '' );
};

const clean = ( msg = '' ) =>
	cleanAllButPermalink( msg )
		.replace( /{permalink}/g, '' )
		.trim();

const cleanAllButPermalink = ( msg = '' ) =>
	msg
		.replace( /{title}/g, '' )
		.replace( /{author}/g, '' )
		.replace( /{excerpt}/g, '' )
		.replace( /{categories}/g, '' )
		.replace( /{tags}/g, '' )
		.replace( /{taxonomy:[^}]*}/g, '' )
		.replace( /{field:[^}]*}/g, '' )
		.replace( /{custom:[^}]*}/g, '' )
		.replace( /  +/g, ' ' )
		.trim();
