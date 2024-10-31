/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';
import { sprintf, _x, _nx } from '@safe-wordpress/i18n';
import type { User } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import {
	castArray,
	chunk,
	every,
	filter,
	isArray,
	keyBy,
	keys,
	map,
	mapValues,
	mergeWith,
	pick,
	pickBy,
	reduce,
	trim,
	uniq,
	values,
	zipObject,
} from 'lodash';
import { store as NC_DATA, usePostTypes } from '@nelio-content/data';
import { doesNetworkSupport, getTargetLabel } from '@nelio-content/networks';
import {
	listify,
	isDefined,
	isUniversalGroup,
	CAT,
	TAG,
	PROD_CAT,
	PROD_TAG,
} from '@nelio-content/utils';
import type {
	AuthorId,
	AutomationGroup,
	AutomationGroupId,
	CustomField,
	CustomKey,
	CustomPlaceholder,
	Maybe,
	MetaKey,
	PostTypeName,
	RegularAutomationGroup,
	RegularAutomationGroupId,
	SocialTemplate,
	SocialTemplateAvailability,
	Taxonomy,
	TaxonomySlug,
	TermId,
	TimeInterval,
	TimeString,
	UniversalAutomationGroup,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_AUTOMATION_SETTINGS } from './store';
import type { TemplateErrors } from './store/types';

export const useAreGroupsDirty = (): boolean =>
	useSelect( ( select ) => {
		const {
			getAutomationGroup: getExistingGroup,
			getAutomationGroups: getExistingGroups,
			getSocialProfiles: getProfiles,
		} = select( NC_DATA );

		const groups = getExistingGroups()
			.map( getExistingGroup )
			.filter( isDefined );
		const profiles = getProfiles();

		return select( NC_AUTOMATION_SETTINGS ).isDirty( groups, profiles );
	} );

export const useAutomationGroups = (): {
	readonly data: ReadonlyArray< AutomationGroup >;
	readonly isLoading: boolean;
} => {
	const { groups, isLoadingGroups } = useSelect( ( select ) => ( {
		groups: select( NC_DATA )
			.getAutomationGroups()
			.map( ( id ) => select( NC_DATA ).getAutomationGroup( id ) )
			.filter( isDefined ),
		isLoadingGroups: ! select( NC_DATA ).hasFinishedResolution(
			'getAutomationGroups'
		),
	} ) );

	const isCachingAuthors = useCache(
		'authors',
		isLoadingGroups ? [] : groups
	);
	const isCachingTerms = useCache( 'terms', isLoadingGroups ? [] : groups );

	return {
		data: groups,
		isLoading: isLoadingGroups || isCachingAuthors || isCachingTerms,
	};
};

export function useAutomationGroup(
	groupId: 'universal'
): UniversalAutomationGroup;
export function useAutomationGroup(
	groupId: Maybe< RegularAutomationGroupId >
): Maybe< RegularAutomationGroup >;
export function useAutomationGroup(
	groupId: Maybe< AutomationGroupId >
): Maybe< AutomationGroup >;
export function useAutomationGroup(
	groupId: Maybe< AutomationGroupId >
): Maybe< AutomationGroup > {
	return useSelect( ( select ) => {
		const { getAutomationGroup } = select( NC_AUTOMATION_SETTINGS );
		return groupId ? getAutomationGroup( groupId ) : undefined;
	} );
} //end useAutomationGroup()

export const useRegularGroupProperty = <
	P extends keyof RegularAutomationGroup,
>(
	groupId: RegularAutomationGroupId,
	property: P
): [
	Maybe< RegularAutomationGroup[ P ] >,
	( value: RegularAutomationGroup[ P ] ) => void,
] => {
	const group = useAutomationGroup( groupId );
	const { updateAutomationGroup } = useDispatch( NC_AUTOMATION_SETTINGS );

	const value = ! group ? undefined : group[ property ];
	const setValue = ( v: RegularAutomationGroup[ P ] ) => {
		if ( ! group ) {
			return;
		} //end if

		void updateAutomationGroup( groupId, { [ property ]: v } );
	};

	return [ value, setValue ];
};

export const useGroupName = ( groupId: AutomationGroupId ): string => {
	const group = useAutomationGroup( groupId );
	const defaultGroupName = usePostSelectionLabel( group ?? {} );
	return isUniversalGroup( group )
		? _x( 'Universal Group', 'text', 'nelio-content' )
		: group?.name || defaultGroupName;
};

// NOTE. This function is equivalent to useHasResults in item select control
export const useEntityRecordLoader = ( postType?: PostTypeName ): boolean => {
	const taxonomies = map( useTaxonomies( postType ), 'slug' );
	const statuses = useSelect( ( select ) => {
		const { hasFinishedResolution, hasResolutionFailed, getEntityRecords } =
			select( CORE );
		const isDone = ( x: string, y: unknown[] ) =>
			hasFinishedResolution( x, y ) || hasResolutionFailed( x, y );

		const searchTaxOpts = {
			per_page: 10,
			context: 'edit',
			search: '',
			page: 1,
			exclude: [],
		};
		const searchUserOpts = {
			per_page: 10,
			context: 'view',
			search: '',
			page: 1,
			exclude: [],
			who: 'authors',
		};

		taxonomies.forEach( ( t ) =>
			getEntityRecords( 'taxonomy', t, searchTaxOpts )
		);
		getEntityRecords( 'root', 'user', searchUserOpts );
		return [
			...taxonomies.map( ( t ) =>
				isDone( 'getEntityRecords', [ 'taxonomy', t, searchTaxOpts ] )
			),
			isDone( 'getEntityRecords', [ 'root', 'user', searchUserOpts ] ),
		];
	} );

	return statuses.every( Boolean );
};

export const useTaxonomies = (
	postType?: PostTypeName
): ReadonlyArray< Taxonomy > =>
	useTaxonomiesPerPostType()[ postType || 'nc_any' ] || [];

type PostSelection = Partial<
	Pick<
		RegularAutomationGroup,
		'postType' | 'taxonomies' | 'authors' | 'publication'
	>
>;

type TemplateSelection = {
	readonly postType?: PostTypeName;
} & Partial<
	Pick<
		SocialTemplate,
		'taxonomies' | 'author' | 'availability' | 'attachment'
	>
>;

export const usePostSelectionLabel = ( {
	authors,
	postType,
	publication,
	taxonomies,
}: PostSelection ): string => {
	const postTypeName = usePostTypeName( postType );
	const byline = useAuthorNames( authors ?? [] );
	const intaxonomies = useInTaxonomyString( postType, taxonomies ?? {} );
	const time = usePublicationString( publication ?? { type: 'always' } );

	const name = sprintf(
		/* translators: 1 -> plural post type name (like “Posts” or “Pages”) or “All Content”, 2 -> byline, 3 -> in taxonomy, 4 -> published time */
		_x( '%1$s %2$s %3$s %4$s', 'text', 'nelio-content' ),
		postTypeName,
		byline,
		intaxonomies,
		time
	);
	return trim( name.replace( /\s+/g, ' ' ) );
};

export const useTemplateSelectionLabel = ( {
	attachment,
	author,
	postType,
	taxonomies,
	availability,
}: TemplateSelection ): string => {
	const postTypeName = usePostTypeName( postType );
	const byline = useAuthorNames( isDefined( author ) ? [ author ] : [] );
	const intaxonomies = useInTaxonomyString(
		postType,
		mapValues( taxonomies, castArray ) ?? {}
	);
	const time = useAvailabilityString( availability );
	const contentType = useContentTypeString( attachment );

	const name = sprintf(
		/* translators: 1 -> plural post type name, 2 -> byline, 3 -> in taxonomy, 4 -> availability time, 5 -> text / image template */
		_x( '%1$s %2$s %3$s %4$s %5$s', 'text', 'nelio-content' ),
		postTypeName,
		byline,
		intaxonomies,
		time,
		contentType
	);
	return trim( name.replace( /\s+/g, ' ' ).replace( / , /g, ', ' ) );
};

export const useCustomFields = (
	type: Maybe< PostTypeName >
): ReadonlyArray< Omit< CustomField, 'value' > > =>
	useSelect( ( select ) => {
		const fields = select( NC_AUTOMATION_SETTINGS ).getCustomFields();
		if ( ! type ) {
			return values(
				keyBy(
					values( fields ).flatMap( ( fs ) => fs ),
					'key'
				)
			);
		} //end if
		return fields[ type ] || [];
	} );

export const useCustomPlaceholders = (
	type: Maybe< PostTypeName >
): ReadonlyArray< Omit< CustomPlaceholder, 'value' > > =>
	useSelect( ( select ) => {
		const placeholders = select(
			NC_AUTOMATION_SETTINGS
		).getCustomPlaceholders();
		if ( ! type ) {
			return values(
				keyBy(
					values( placeholders ).flatMap( ( ps ) => ps ),
					'key'
				)
			);
		} //end if
		return placeholders[ type ] || [];
	} );

export const useSupportsAuthor = ( postType: Maybe< PostTypeName > ): boolean =>
	!! useSupportsAuthorPerPostType()[ postType || 'nc_any' ];

export const useTemplateErrors = (
	group: Maybe< AutomationGroup >,
	templates: ReadonlyArray< SocialTemplate >
): Record< Uuid, TemplateErrors > => {
	const supportsAuthor = useSupportsAuthorPerPostType();
	const taxSlugs = mapValues( useTaxonomiesPerPostType(), ( ts ) =>
		map( ts, 'slug' )
	);
	const contentErrors = useTemplateContentErrors( templates );

	return useSelect(
		( select ) => {
			const {
				getEntityRecord,
				hasFinishedResolution,
				hasResolutionFailed,
			} = select( CORE );

			const isDone = ( fn: string, args: unknown[] ): boolean =>
				hasFinishedResolution( fn, args ) ||
				hasResolutionFailed( fn, args );

			const exists = (
				kind: 'root' | 'taxonomy',
				type: string,
				value: Maybe< number >
			): boolean =>
				! value ||
				!! getEntityRecord( kind, type, value, {
					context: type === 'user' ? 'view' : 'edit',
				} ) ||
				! isDone( 'getEntityRecord', [
					kind,
					type,
					value,
					{ context: type === 'user' ? 'view' : 'edit' },
				] );

			const inArray = < T >(
				arr: Maybe< ReadonlyArray< T > >,
				v: Maybe< T >
			): boolean => ! v || ! arr?.length || arr.includes( v );

			if ( ! group ) {
				return {};
			} //end if

			return mapValues(
				keyBy( castArray( templates ), 'id' ),
				( t ): TemplateErrors => ( {
					target:
						!! t.profileId &&
						!! doesNetworkSupport( 'multi-target', t.network ) &&
						! t.targetName &&
						getTargetLabel( 'selectTargetError', t.network ),
					content: contentErrors[ t.id ] ?? false,
					availability:
						!! t.availability &&
						getAvailabilityErrors( t.availability ),
					author: getAuthorError( {
						doesAuthorExist: exists( 'root', 'user', t.author ),
						isAuthorSupported:
							!! supportsAuthor[ t.postType || 'nc_any' ],
						isGroupAuthor:
							isUniversalGroup( group ) ||
							inArray( group.authors, t.author ),
					} ),
					taxonomies: pick(
						mapValues( t.taxonomies, ( value, slug ) =>
							getTaxonomyError( {
								doesTermExist: exists(
									'taxonomy',
									slug,
									value
								),
								isGroupTerm:
									isUniversalGroup( group ) ||
									inArray( group.taxonomies[ slug ], value ),
							} )
						),
						taxSlugs[ t.postType || 'nc_any' ] || []
					),
				} )
			);
		},
		[
			JSON.stringify( supportsAuthor ),
			JSON.stringify( taxSlugs ),
			JSON.stringify( contentErrors ),
			JSON.stringify( templates ),
		]
	);
};

export const useIsSaving = (): boolean =>
	useSelect( ( select ) => select( NC_AUTOMATION_SETTINGS ).isSaving() );

// ============
// HELPER HOOKS
// ============

const usePostTypeName = ( postType: Maybe< PostTypeName > ): string => {
	const postTypes = usePostTypes( 'social' );
	if ( ! postType ) {
		return _x( 'All Content', 'text', 'nelio-content' );
	} //end if

	const postTypeData = postTypes.find( ( p ) => p.name === postType );
	return (
		postTypeData?.labels.plural ||
		sprintf(
			/* translators: post type name */
			_x( 'Post type %s', 'text', 'nelio-content' ),
			postType
		)
	);
};

const useAuthorNames = (
	authors: RegularAutomationGroup[ 'authors' ]
): string => {
	const usernames = useSelect( ( select ) => {
		const { getEntityRecord } = select( CORE );
		return authors
			.map(
				( id ): Maybe< User > =>
					getEntityRecord( 'root', 'user', id, { context: 'view' } )
			)
			.map( ( author ) => author?.name )
			.filter( isDefined );
	} );

	if ( ! usernames.length ) {
		return '';
	} //end if

	return sprintf(
		/* translators: author name(s) */
		_x( 'by %s', 'text', 'nelio-content' ),
		listify( 'or', usernames )
	);
};

const useInTaxonomyString = (
	postType: Maybe< PostTypeName >,
	taxonomies: RegularAutomationGroup[ 'taxonomies' ]
): string => {
	const postTaxonomies = map( useTaxonomies( postType ), 'slug' );
	const taxSlugs = keys( taxonomies ).filter( ( t ) =>
		postTaxonomies.includes( t )
	);

	const taxonomyNames: Record< TaxonomySlug, string > = useSelect(
		( select ) => {
			const { getEntityRecord } = select( CORE );
			const taxNames = taxSlugs
				.map(
					( t ): Maybe< Taxonomy > =>
						getEntityRecord( 'root', 'taxonomy', t )
				)
				.map( ( t ) => t?.labels.singular_name );
			return pickBy(
				zipObject( taxSlugs, taxNames ),
				( x ): x is string => 'string' === typeof x
			);
		},
		[ JSON.stringify( taxSlugs ) ]
	);

	const relevantTaxonomies = pick( taxonomies, taxSlugs );
	const taxonomyTerms: Record<
		TaxonomySlug,
		ReadonlyArray< string >
	> = useSelect(
		( select ) => {
			const { getEntityRecord } = select( CORE );
			return mapValues( relevantTaxonomies, ( terms, taxonomy ) =>
				terms
					.map(
						( term ) =>
							getEntityRecord( 'taxonomy', taxonomy, term, {
								context: 'edit',
							} ) as Maybe< { name: string } >
					)
					.map( ( term ) => term?.name )
					.filter( isDefined )
			);
		},
		[ JSON.stringify( relevantTaxonomies ) ]
	);

	const taxsWithTerms = keys( taxonomyNames ).filter(
		( tax: TaxonomySlug ) => !! taxonomyTerms[ tax ]?.length
	);

	const hasCats =
		!! taxonomyTerms[ CAT ]?.length || !! taxonomyTerms[ PROD_CAT ]?.length;

	const hasTags =
		!! taxonomyTerms[ TAG ]?.length || !! taxonomyTerms[ PROD_TAG ]?.length;

	const catsAndTags: string[] = [];
	if ( hasCats ) {
		catsAndTags.push(
			sprintf(
				/* translators: category names */
				_x( 'in %s', 'text', 'nelio-content' ),
				listify(
					'or',
					taxonomyTerms[ CAT ] ?? taxonomyTerms[ PROD_CAT ] ?? []
				)
			)
		);
	} //end if

	if ( hasTags ) {
		catsAndTags.push(
			sprintf(
				/* translators: tag names */
				_x( 'tagged as %s', 'text', 'nelio-content' ),
				listify(
					'or',
					taxonomyTerms[ TAG ] ?? taxonomyTerms[ PROD_TAG ] ?? []
				)
			)
		);
	} //end if

	const otherTaxs = taxsWithTerms
		.filter( ( tax ) => ! [ CAT, PROD_CAT, TAG, PROD_TAG ].includes( tax ) )
		.map( ( tax, i ) =>
			! i
				? sprintf(
						/* translators: 1 -> taxonomy name, 2 -> taxonomy terms */
						_x(
							'with %2$s in taxonomy %1$s',
							'text',
							'nelio-content'
						),
						taxonomyNames[ tax ],
						listify( 'or', taxonomyTerms[ tax ] ?? [] )
				  )
				: sprintf(
						/* translators: 1 -> taxonomy name, 2 -> taxonomy terms */
						_x( '%2$s in taxonomy %1$s', 'text', 'nelio-content' ),
						taxonomyNames[ tax ],
						listify( 'or', taxonomyTerms[ tax ] ?? [] )
				  )
		);

	return listify( 'and', [ ...catsAndTags, ...otherTaxs ] );
};

const usePublicationString = (
	publication: AutomationGroup[ 'publication' ]
): string => {
	if ( publication.type === 'always' ) {
		return '';
	} //end if

	const knownValues: Record< string, string > = {
		'30': _x( 'from last month', 'text', 'nelio-content' ),
		'60': _x( 'from last two months', 'text', 'nelio-content' ),
		'90': _x( 'from last three months', 'text', 'nelio-content' ),
		'180': _x( 'from last six months', 'text', 'nelio-content' ),
		'365': _x( 'from last year', 'text', 'nelio-content' ),
	};

	return (
		knownValues[ `${ publication.days }` ] ||
		sprintf(
			/* translators: number of days */
			_x( 'from last %d days', 'text', 'nelio-content' ),
			publication.days
		)
	);
};

const useAvailabilityString = (
	availability: SocialTemplate[ 'availability' ]
): string => {
	if ( ! availability ) {
		return '';
	} //end if

	let time = '';
	switch ( availability.type ) {
		case 'publication-day-offset':
			time =
				availability.hoursAfterPublication === 0
					? _x( 'on publication', 'text', 'nelio-content' )
					: sprintf(
							/* translators: number of hours */
							_nx(
								'%d hour after publication',
								'%d hours after publication',
								availability.hoursAfterPublication,
								'text',
								'nelio-content'
							),
							availability.hoursAfterPublication
					  );
			break;

		case 'publication-day-period':
			time = getTimeString( availability.time );
			break;

		case 'after-publication':
			switch ( availability.daysAfterPublication ) {
				case 0:
					time = _x( 'on publication', 'text', 'nelio-content' );
					break;

				case 1:
					time = _x(
						'the day after publication',
						'text',
						'nelio-content'
					);
					break;

				case 7:
					time = _x(
						'one week after publication',
						'text',
						'nelio-content'
					);
					break;

				case 28:
				case 29:
				case 30:
				case 31:
					time = _x(
						'one month after publication',
						'text',
						'nelio-content'
					);
					break;

				default:
					time = sprintf(
						/* translators: number of days */
						_x(
							'%d days after publication',
							'text',
							'nelio-content'
						),
						availability.daysAfterPublication
					);
					break;
			}
			time += ' ' + getTimeString( availability.time );
			break;

		case 'reshare':
			const days = keys( availability.weekday ).filter(
				( d ) => availability.weekday[ d ] !== false
			);

			let weekdays = '';
			if ( days.length === 7 ) {
				weekdays = _x( 'every day', 'text', 'nelio-content' );
			} else if (
				days.length === 2 &&
				days.includes( 'sat' ) &&
				days.includes( 'sun' )
			) {
				weekdays = _x( 'on weekends', 'text', 'nelio-content' );
			} else if (
				days.length === 5 &&
				! days.includes( 'sat' ) &&
				! days.includes( 'sun' )
			) {
				weekdays = _x( 'on weekdays', 'text', 'nelio-content' );
			} else if ( days.length === 1 ) {
				weekdays = sprintf(
					/* translators: a day of the week */
					_x( 'all week but %s,', 'text', 'nelio-content' ),
					expandShortDayNames( days )[ 0 ]
				);
			} else {
				weekdays = sprintf(
					/* translators: a list of days */
					_x( 'on %s', 'text', 'nelio-content' ),
					listify( 'and', expandShortDayNames( days ) )
				);
			} //end if
			time = weekdays + ' ' + getTimeString( availability.time );
			break;
	} //end switch

	return sprintf(
		/* translators: time period */
		_x( ', used %s', 'text', 'nelio-content' ),
		time
	);
};

const useContentTypeString = (
	attachment: SocialTemplate[ 'attachment' ]
): string => {
	if ( ! attachment ) {
		return '';
	} //end if

	switch ( attachment ) {
		case 'none':
			return _x( '(text only)', 'text', 'nelio-content' );
		case 'image':
			return _x( '(image)', 'text', 'nelio-content' );
		case 'video':
			return _x( '(video)', 'text', 'nelio-content' );
	} //end switch
};

const useAllTaxonomies = (): ReadonlyArray< Taxonomy > =>
	filter(
		useSelect(
			( select ): Taxonomy[] =>
				select( CORE ).getEntityRecords( 'root', 'taxonomy', {
					per_page: -1,
				} ) || [],
			[]
		),
		( t ) => t.visibility.public
	);

const useTemplateContentErrors = (
	templates: ReadonlyArray< SocialTemplate >
): Record< Uuid, string | false > => {
	const customFields = mapValues( useCustomFieldsPerPostType(), ( fs ) =>
		map( fs, 'key' )
	);
	const customPlaceholders = mapValues(
		useCustomPlaceholdersPerPostType(),
		( ps ) => map( ps, 'key' )
	);
	const supportsAuthor = useSupportsAuthorPerPostType();
	const taxSlugs = mapValues( useTaxonomiesPerPostType(), ( ts ) =>
		map( ts, 'slug' )
	);

	const errors = map( templates, ( t ) => {
		if ( ! trim( t.text ).length ) {
			return _x(
				'Please create a template with some content',
				'user',
				'nelio-content'
			);
		} //end if

		const unsupportedPlaceholder =
			/* translators: a placeholder name, like author or tags */
			_x(
				'Unsupported %s placeholder found in template',
				'text',
				'nelio-content'
			);

		if (
			! supportsAuthor[ t.postType || 'nc_any' ] &&
			t.text.includes( '{author}' )
		) {
			return sprintf( unsupportedPlaceholder, '{author}' );
		} //end if

		const tss = taxSlugs[ t.postType || 'nc_any' ] || [];
		if (
			! tss.includes( CAT ) &&
			! tss.includes( PROD_CAT ) &&
			t.text.includes( '{categories}' )
		) {
			return sprintf( unsupportedPlaceholder, '{categories}' );
		} //end if

		if (
			! tss.includes( TAG ) &&
			! tss.includes( PROD_TAG ) &&
			t.text.includes( '{tags}' )
		) {
			return sprintf( unsupportedPlaceholder, '{tags}' );
		} //end if

		const usedTaxonomies = map(
			Array.from( t.text.matchAll( /{taxonomy:([^}]+)}/g ) ),
			1
		);
		for ( const usedTaxSlug of usedTaxonomies ) {
			if ( ! tss.includes( usedTaxSlug as TaxonomySlug ) ) {
				return sprintf(
					unsupportedPlaceholder,
					`{taxonomy:${ usedTaxSlug }}`
				);
			} //end if
		} //end for

		const cfs = t.postType
			? customFields[ t.postType ] || []
			: values( customFields ).flatMap( ( i ) => i );
		const usedCustomFields = map(
			Array.from( t.text.matchAll( /{field:([^}]+)}/g ) ),
			1
		);
		for ( const usedCustomField of usedCustomFields ) {
			if ( ! cfs.includes( usedCustomField as MetaKey ) ) {
				return sprintf(
					unsupportedPlaceholder,
					`{field:${ usedCustomField }}`
				);
			} //end if
		} //end for

		const cps = t.postType
			? customPlaceholders[ t.postType ] || []
			: values( customPlaceholders ).flatMap( ( i ) => i );
		const usedCustomPlaceholders = map(
			Array.from( t.text.matchAll( /{custom:([^}]+)}/g ) ),
			1
		);
		for ( const usedCustomPlaceholder of usedCustomPlaceholders ) {
			if ( ! cps.includes( usedCustomPlaceholder as CustomKey ) ) {
				return sprintf(
					unsupportedPlaceholder,
					`{custom:${ usedCustomPlaceholder }}`
				);
			} //end if
		} //end for

		return false;
	} );

	const ids = map( templates, 'id' );
	return zipObject( ids, errors );
};

const useCustomFieldsPerPostType = () =>
	useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getCustomFields()
	);

const useCustomPlaceholdersPerPostType = () =>
	useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getCustomPlaceholders()
	);

const useTaxonomiesPerPostType = () => {
	const allPostTypes = map( usePostTypes( 'social' ), 'name' );
	const taxonomies = useAllTaxonomies();
	return reduce(
		[ 'nc_any' as const, ...allPostTypes ],
		( result, name ) => {
			const postTypes = name === 'nc_any' ? allPostTypes : [ name ];
			result[ name ] = filter( taxonomies, ( tax ) =>
				postTypes.some( ( pt ) => tax.types.includes( pt ) )
			);
			return result;
		},
		{ nc_any: [] } as Record<
			'nc_any' | PostTypeName,
			ReadonlyArray< Taxonomy >
		>
	);
};

const useSupportsAuthorPerPostType = () => {
	const postTypes = usePostTypes( 'social' );
	return reduce(
		[ 'nc_any' as const, ...map( postTypes, 'name' ) ],
		( result, name ) => {
			result[ name ] = postTypes
				.filter( ( pt ) => name === 'nc_any' || pt.name === name )
				.some( ( pt ) => pt.supports.author );
			return result;
		},
		{ nc_any: false } as Record< 'nc_any' | PostTypeName, boolean >
	);
};

// =======
// HELPERS
// =======

const getAvailabilityErrors = (
	availability: SocialTemplateAvailability
): string | false => {
	switch ( availability.type ) {
		case 'publication-day-offset':
			return 0 <= availability.hoursAfterPublication &&
				availability.hoursAfterPublication <= 24
				? false
				: _x(
						'Please select a number of hours after publication between 0 and 24 for the availability time.',
						'user',
						'nelio-content'
				  );

		case 'publication-day-period':
			return getTimeErrors( availability.time );

		case 'after-publication':
			if ( availability.daysAfterPublication < 0 ) {
				return _x(
					'Please select a valid positive number of days after publication for the availability date.',
					'user',
					'nelio-content'
				);
			} //end if

			return getTimeErrors( availability.time );

		case 'reshare':
			if ( ! values( availability.weekday ).some( Boolean ) ) {
				return _x(
					'Please select at least one day for the availability date or the template will not be used.',
					'user',
					'nelio-content'
				);
			} //end if

			return getTimeErrors( availability.time );
	} //end switch
};

const getTimeErrors = ( t: TimeString ): false | string => {
	return isValidTime( t )
		? false
		: _x(
				'Please select a valid availability time.',
				'user',
				'nelio-content'
		  );
};

const getTimeString = ( time: TimeString ): string => {
	switch ( time ) {
		case 'morning':
			return _x( 'in the morning', 'text', 'nelio-content' );
		case 'noon':
			return _x( 'at noon', 'text', 'nelio-content' );
		case 'afternoon':
			return _x( 'in the afternoon', 'text', 'nelio-content' );
		case 'night':
			return _x( 'at night', 'text', 'nelio-content' );
		default:
			return sprintf(
				/* translators: a fixed time in the format HH:mm */ _x(
					'at %s',
					'text',
					'nelio-content'
				),
				time
			);
	} //end switch
};

const getAuthorError = ( {
	doesAuthorExist,
	isAuthorSupported,
	isGroupAuthor,
}: {
	readonly doesAuthorExist: boolean;
	readonly isAuthorSupported: boolean;
	readonly isGroupAuthor: boolean;
} ): string | false => {
	if ( ! isAuthorSupported ) {
		return false;
	} //end if

	if ( ! doesAuthorExist ) {
		return _x( 'Selected author doesn’t exist', 'text', 'nelio-content' );
	} //end if

	if ( ! isGroupAuthor ) {
		return _x(
			'The author is not among those selected in the automation group',
			'text',
			'nelio-content'
		);
	} //end if

	return false;
};

const getTaxonomyError = ( {
	doesTermExist,
	isGroupTerm,
}: {
	readonly doesTermExist: boolean;
	readonly isGroupTerm: boolean;
} ): string | false => {
	if ( ! doesTermExist ) {
		return _x( 'Selected term doesn’t exist', 'text', 'nelio-content' );
	} //end if

	if ( ! isGroupTerm ) {
		return _x(
			'The term is not among those selected in the automation group',
			'text',
			'nelio-content'
		);
	} //end if

	return false;
};

const isValidTime = ( t: TimeString ): boolean => {
	return (
		isTimeInterval( t ) ||
		/^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/.test( t )
	);
};

const isTimeInterval = ( t: TimeString ): t is TimeInterval => {
	return [ 'morning', 'noon', 'afternoon', 'night' ].includes( t );
};

function expandShortDayNames( days: string[] ): readonly string[] {
	return days.map( ( day ) => {
		switch ( day ) {
			case 'mon':
				return _x( 'Monday', 'text', 'nelio-content' );
			case 'tue':
				return _x( 'Tuesday', 'text', 'nelio-content' );
			case 'wed':
				return _x( 'Wednesday', 'text', 'nelio-content' );
			case 'thu':
				return _x( 'Thursday', 'text', 'nelio-content' );
			case 'fri':
				return _x( 'Friday', 'text', 'nelio-content' );
			case 'sat':
				return _x( 'Saturday', 'text', 'nelio-content' );
			case 'sun':
				return _x( 'Sunday', 'text', 'nelio-content' );
			default:
				return '';
		} //end switch
	} );
}

const useFakeResolution = () => {
	const { startResolution, finishResolution } = useDispatch( CORE );
	return ( fn: string, args: unknown[] ) => {
		void startResolution( fn, args );
		void finishResolution( fn, args );
	};
};

type CacheStatus = 'loading-groups' | 'loading-entities' | 'done';

const useCache = (
	entityType: 'authors' | 'terms',
	groups: ReadonlyArray< AutomationGroup >
) => {
	const [ status, setStatus ] = useState< CacheStatus >(
		groups.length ? 'loading-entities' : 'loading-groups'
	);
	const allEntities: Record< string, ReadonlyArray< number > > = 'authors' ===
	entityType
		? getAuthors( groups )
		: getTermsByTax( groups );

	const root = 'authors' === entityType ? 'root' : 'taxonomy';
	const context = 'authors' === entityType ? 'view' : 'edit';

	useEffect( () => {
		if ( !! groups.length && 'loading-groups' === status ) {
			setStatus( 'loading-entities' );
		} //end if
	}, [ !! groups.length, status ] );

	const { loadedEntities, hasFinishedResolution } = useSelect( ( select ) => {
		select( CORE );
		if ( 'loading-entities' !== status || ! keys( allEntities ).length ) {
			return { loadedEntities: {}, hasFinishedResolution: true };
		} //end if

		return {
			loadedEntities: mapValues( allEntities, ( allIds, key ) =>
				chunk( allIds, 100 ).flatMap( ( ids ) =>
					map(
						select( CORE ).getEntityRecords( root, key, {
							include: ids.join( ',' ),
							per_page: ids.length,
							context,
						} ) as { id: number }[],
						( es ) => es.id as TermId
					)
				)
			),

			hasFinishedResolution: every(
				values(
					mapValues( allEntities, ( allIds, key ) =>
						every(
							chunk( allIds, 100 ).flatMap( ( ids ) =>
								select( CORE ).hasFinishedResolution(
									'getEntityRecords',
									[
										root,
										key,
										{
											include: ids.join( ',' ),
											per_page: ids.length,
											context,
										},
									]
								)
							)
						)
					)
				)
			),
		};
	} );

	const resolve = useFakeResolution();
	useEffect( () => {
		if ( 'loading-entities' === status && hasFinishedResolution ) {
			mapValues( loadedEntities, ( ids, key ) =>
				ids.forEach( ( id ) =>
					resolve( 'getEntityRecord', [ root, key, id, { context } ] )
				)
			);
			setStatus( 'done' );
		} //end if
	}, [ status, hasFinishedResolution ] );

	return 'done' !== status;
};

const getAuthors = (
	groups: ReadonlyArray< AutomationGroup >
): { user: ReadonlyArray< AuthorId > } => {
	const templateAuthors = groups
		.flatMap( ( g ) => [
			...values( g.profileSettings ),
			...values( g.networkSettings ),
		] )
		.flatMap( ( s ) => [
			...s.publication.templates,
			...s.reshare.templates,
		] )
		.map( ( t ) => t.author )
		.filter( isDefined );
	const groupAuthors = groups.flatMap( ( g ) =>
		isUniversalGroup( g ) ? [] : g.authors
	);
	return { user: uniq( [ ...templateAuthors, ...groupAuthors ] ) };
};

const getTermsByTax = (
	groups: ReadonlyArray< AutomationGroup >
): Record< TaxonomySlug, ReadonlyArray< TermId > > => {
	const templateTaxonomies = groups
		.flatMap( ( g ) => [
			...values( g.profileSettings ),
			...values( g.networkSettings ),
		] )
		.flatMap( ( s ) => [
			...s.publication.templates,
			...s.reshare.templates,
		] )
		.map( ( t ) => mapValues( t.taxonomies, ( ts ) => [ ts ] ) );

	const groupTaxonomies = groups.flatMap( ( g ) =>
		isUniversalGroup( g ) ? [] : g.taxonomies
	);

	const allTaxonomies = [ ...templateTaxonomies, ...groupTaxonomies ];
	const loadedTermsByTax = reduce(
		allTaxonomies,
		( result, record ) =>
			mergeWith( result, record, ( a, b ) =>
				// eslint-disable-next-line
				isArray( a ) && isArray( b ) ? [ ...a, ...b ] : undefined
			),
		{} as Record< TaxonomySlug, ReadonlyArray< TermId > >
	);
	return mapValues( loadedTermsByTax, uniq );
};
