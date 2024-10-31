/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	every,
	flatten,
	map,
	mapValues,
	filter,
	pick,
	values,
	zipObject,
} from 'lodash';
import { usePostType, usePostTypes } from '@nelio-content/data';
import { isUniversalGroup } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';
import {
	useAutomationGroup,
	useTaxonomies,
	useTemplateErrors,
} from '~/nelio-content-pages/settings/automations/hooks';

import type {
	AutomationGroup,
	AutomationGroupId,
	Maybe,
	SocialTemplate,
	TaxonomySlug,
	TermId,
	UserId,
	Uuid,
} from '@nelio-content/types';

export const useValidationEffect = ( groupId: AutomationGroupId ): void => {
	const group = useAutomationGroup( groupId );
	const managedPostTypes = map( usePostTypes( 'social' ), 'name' );
	const isPostTypeValid = isUniversalGroup( group )
		? true
		: !! group?.postType && managedPostTypes.includes( group.postType );

	const areAuthorsValid = useAreAuthorsValid( group );
	const areTermsValid = useAreTermsValid( group );
	const socialProfileErrors = useSocialProfileErrors( group );

	const templateErrors = useTemplateErrors( group, getAllTemplates( group ) );

	const { setAutomationGroupValidation } = useDispatch(
		NC_AUTOMATION_SETTINGS
	);

	useEffect( () => {
		if ( ! group ) {
			return;
		} //end if

		void setAutomationGroupValidation( groupId, {
			isPostTypeValid,
			areAuthorsValid,
			areTermsValid,
			socialProfileErrors,
			templateErrors,
		} );
	}, [
		JSON.stringify( isPostTypeValid ),
		JSON.stringify( areAuthorsValid ),
		JSON.stringify( areTermsValid ),
		JSON.stringify( socialProfileErrors ),
		JSON.stringify( templateErrors ),
	] );
};

// =====
// HOOKS
// =====

const useAreAuthorsValid = ( group: Maybe< AutomationGroup > ): boolean => {
	const postType = isUniversalGroup( group ) ? undefined : group?.postType;
	const supportsAuthor = !! usePostType( postType )?.supports.author;
	return useSelect( ( select ): boolean => {
		select( CORE );
		if ( ! supportsAuthor || isUniversalGroup( group ) ) {
			return true;
		} //end if

		const { getEntityRecord, hasFinishedResolution, hasResolutionFailed } =
			select( CORE );

		const load = ( id: UserId ) =>
			getEntityRecord( 'root', 'user', id, { context: 'view' } );

		const isDone = ( id: UserId ) =>
			hasFinishedResolution( 'getEntityRecord', [
				'root',
				'user',
				id,
				{ context: 'view' },
			] ) ||
			hasResolutionFailed( 'getEntityRecord', [
				'root',
				'user',
				id,
				{ context: 'view' },
			] );

		const authors = group?.authors ?? [];
		const items = map( authors, load );
		const finished = map( authors, isDone );
		return ! every( finished ) || every( items );
	} );
};

const useAreTermsValid = (
	group: Maybe< AutomationGroup >
): Record< TaxonomySlug, boolean > => {
	const postType = isUniversalGroup( group ) ? undefined : group?.postType;
	const supportedTaxonomies = map( useTaxonomies( postType ), 'slug' );
	const taxonomies: Record< TaxonomySlug, ReadonlyArray< TermId > > = pick(
		{
			...zipObject(
				supportedTaxonomies,
				map( supportedTaxonomies, () => [] )
			),
			...( isUniversalGroup( group ) ? {} : group?.taxonomies ?? {} ),
		},
		supportedTaxonomies
	);

	return useSelect( ( select ): Record< TaxonomySlug, boolean > => {
		const { getEntityRecord, hasFinishedResolution, hasResolutionFailed } =
			select( CORE );

		const load = ( tax: TaxonomySlug ) => ( term: TermId ) =>
			getEntityRecord( 'taxonomy', tax, term ) || undefined;

		const isDone =
			( tax: TaxonomySlug ) =>
			( term: TermId ): boolean =>
				!! hasFinishedResolution( 'getEntityRecord', [
					'taxonomy',
					tax,
					term,
				] ) ||
				!! hasResolutionFailed( 'getEntityRecord', [
					'taxonomy',
					tax,
					term,
				] );

		const items = mapValues( taxonomies, ( terms, tax: TaxonomySlug ) =>
			terms.map( load( tax ) )
		);

		const finished = mapValues( taxonomies, ( terms, tax: TaxonomySlug ) =>
			terms.map( isDone( tax ) )
		);

		return mapValues(
			taxonomies,
			( _, tax: TaxonomySlug ): boolean =>
				! every( finished[ tax ] ) || every( items[ tax ] )
		);
	} );
};

const useSocialProfileErrors = (
	group: Maybe< AutomationGroup >
): Record< Uuid, string | false > =>
	mapValues( group?.profileSettings, ( ps ) =>
		ps.enabled && ! ps.publication.enabled && ! ps.reshare.enabled
			? _x(
					'Missing permissions to automatically share content on your behalf',
					'user',
					'nelio-content'
			  )
			: false
	);

// =======
// HELPERS
// =======

const getAllTemplates = (
	group: Maybe< AutomationGroup >
): ReadonlyArray< SocialTemplate > => {
	const ps = filter( values( group?.profileSettings ), { enabled: true } );
	const networks = map( ps, 'network' );
	const ns = values( pick( group?.networkSettings, networks ) );

	return [
		...flatten(
			map(
				filter( map( ps, 'publication' ), { enabled: true } ),
				'templates'
			)
		),
		...flatten(
			map(
				filter( map( ps, 'reshare' ), { enabled: true } ),
				'templates'
			)
		),
		...flatten( map( map( ns, 'publication' ), 'templates' ) ),
		...flatten( map( map( ns, 'reshare' ), 'templates' ) ),
	];
};
