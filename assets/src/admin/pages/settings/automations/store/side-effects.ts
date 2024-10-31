/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { store as CORE } from '@safe-wordpress/core-data';
import { select, dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { castArray, map, mapValues, pick, pickBy } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import {
	isDefined,
	isUniversalGroup,
	showErrorNotice,
} from '@nelio-content/utils';
import type {
	AutomationGroup,
	Maybe,
	NetworkAutomationSettings,
	PostTypeName,
	ProfileAutomationSettings,
	SocialNetworkName,
	SocialProfile,
	SocialTemplate,
	Taxonomy,
	TaxonomySlug,
} from '@nelio-content/types';

/**
 * External dependencies
 */
import { store as NC_AUTOMATION_SETTINGS } from '../store';

export async function saveAutomationGroups(): Promise< void > {
	await dispatch( NC_AUTOMATION_SETTINGS ).markAsSaving( true );

	const { getAutomationGroup, getAutomationGroups } = select(
		NC_AUTOMATION_SETTINGS
	);
	const automationGroups: ReadonlyArray< AutomationGroup > =
		await Promise.all(
			getAutomationGroups()
				.map( getAutomationGroup )
				.filter( isDefined )
				.map( cleanAutomationGroup )
		);

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		const profiles = await updateProfileFrequencies();

		const response = await apiFetch< ReadonlyArray< AutomationGroup > >( {
			url: `${ apiRoot }/site/${ siteId }/automation-groups`,
			method: 'PUT',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: automationGroups,
		} );

		await dispatch( NC_AUTOMATION_SETTINGS ).initAutomationGroups(
			response,
			profiles
		);
		await dispatch( NC_DATA ).resetAutomationGroups( response );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_AUTOMATION_SETTINGS ).markAsSaving( false );
} //end saveTemplate()

// =======
// HELPERS
// =======

const updateProfileFrequencies = async (): Promise<
	ReadonlyArray< SocialProfile >
> =>
	Promise.all(
		select( NC_DATA )
			.getSocialProfiles()
			.map( async ( profile ) => {
				if ( ! isProfileDirty( profile ) ) {
					return profile;
				} //end if

				const freqs = select(
					NC_AUTOMATION_SETTINGS
				).getProfileFrequencies( profile.id );
				if ( ! freqs ) {
					return profile;
				} //end if

				const siteId = select( NC_DATA ).getSiteId();
				const apiRoot = select( NC_DATA ).getApiRoot();
				const token = select( NC_DATA ).getAuthenticationToken();

				const newProfile = await apiFetch< SocialProfile >( {
					url: `${ apiRoot }/site/${ siteId }/profile/${ profile.id }`,
					method: 'PUT',
					credentials: 'omit',
					mode: 'cors',
					headers: {
						Authorization: `Bearer ${ token }`,
					},
					data: {
						publicationFrequency: freqs.publication,
						reshareFrequency: freqs.reshare,
					},
				} );

				await dispatch( NC_DATA ).receiveSocialProfiles( newProfile );

				return newProfile;
			} )
	);

const isProfileDirty = ( profile: SocialProfile ) => {
	const freqs = select( NC_AUTOMATION_SETTINGS ).getProfileFrequencies(
		profile.id
	);
	return (
		freqs?.publication !== profile.publicationFrequency ||
		freqs?.reshare !== profile.reshareFrequency
	);
};

const cleanAutomationGroup = async (
	group: AutomationGroup
): Promise< AutomationGroup > => {
	if ( isUniversalGroup( group ) ) {
		return group;
	} //end if

	const taxonomies = await getTaxonomies( group.postType );
	const supportsAuthors = doesSupportAuthors( group.postType );
	const clean = cleanSettings( { taxonomies, supportsAuthors } );

	return {
		...group,
		authors: false === supportsAuthors ? [] : group.authors,
		taxonomies: pick( group.taxonomies, taxonomies ),
		profileSettings: mapValues( group.profileSettings, clean ),
		networkSettings: pickBy<
			Partial< Record< SocialNetworkName, NetworkAutomationSettings > >
		>(
			mapValues( group.networkSettings, clean ),
			( settings ) =>
				!! settings &&
				( !! settings.publication.templates.length ||
					!! settings.reshare.templates.length )
		),
	};
};

type PostTypeSettings = {
	readonly supportsAuthors: Maybe< boolean >;
	readonly taxonomies: ReadonlyArray< TaxonomySlug >;
};

const cleanSettings =
	( pts: PostTypeSettings ) =>
	< T extends ProfileAutomationSettings | NetworkAutomationSettings >(
		settings: T
	): T => {
		const clean = cleanTemplate( pts );
		return {
			...settings,
			publication: {
				...settings.publication,
				templates: map( settings.publication.templates, clean ),
			},
			reshare: {
				...settings.reshare,
				templates: map( settings.reshare.templates, clean ),
			},
		};
	};

const cleanTemplate =
	( pts: PostTypeSettings ) =>
	( template: SocialTemplate ): SocialTemplate => ( {
		...template,
		author: false === pts.supportsAuthors ? undefined : template.author,
		taxonomies: pick( template.taxonomies, pts.taxonomies ),
	} );

const doesSupportAuthors = ( type: PostTypeName ): Maybe< boolean > =>
	select( NC_DATA ).getPostType( type )?.supports.author;

const getTaxonomies = async (
	type: PostTypeName
): Promise< ReadonlyArray< TaxonomySlug > > => {
	const { getEntityRecords } = resolveSelect( CORE );
	const allTaxonomies = await getEntityRecords( 'root', 'taxonomy', {
		per_page: -1,
	} );
	return castArray( allTaxonomies )
		.filter( ( t ): t is Taxonomy => !! t )
		.filter( ( t ) => t.types.includes( type ) )
		.map( ( t ) => t.slug as TaxonomySlug );
};
