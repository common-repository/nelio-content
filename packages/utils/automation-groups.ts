/**
 * External dependencies
 */
import {
	intersection,
	keyBy,
	keys,
	map,
	mapValues,
	uniq,
	values,
} from 'lodash';
import { doesNetworkSupport } from '@nelio-content/networks';
import type {
	AutomationGroup,
	Maybe,
	NetworkAutomationSettings,
	ProfileAutomationSettings,
	SocialNetworkName,
	SocialTemplate,
	UniversalAutomationGroup,
} from '@nelio-content/types';

export const isUniversalGroup = (
	g: Maybe< AutomationGroup >
): g is UniversalAutomationGroup => g?.id === 'universal';

export function fixAttributesInGroup< G extends AutomationGroup >(
	group: G
): G {
	group = fixNetworkSettings( group );
	group = disableAutoSharesIfNoTemplates( group );
	group = fixPostTypeInTemplates( group );
	return group;
} //end fixAttributesInGroup()

// =======
// HELPERS
// =======

function fixPostTypeInTemplates< G extends AutomationGroup >( group: G ): G {
	if ( isUniversalGroup( group ) ) {
		return group;
	} //end if

	const fixTemplate = ( t: SocialTemplate ) => ( {
		...t,
		postType: group.postType,
	} );

	const fixTemplatesInSettings = <
		T extends ProfileAutomationSettings | NetworkAutomationSettings,
	>(
		settings: T
	): T => ( {
		...settings,
		publication: {
			...settings.publication,
			templates: map( settings.publication.templates, fixTemplate ),
		},
		reshare: {
			...settings.reshare,
			templates: map( settings.reshare.templates, fixTemplate ),
		},
	} );

	return {
		...group,
		profileSettings: mapValues(
			group.profileSettings,
			fixTemplatesInSettings
		),
		networkSettings: mapValues(
			group.networkSettings,
			fixTemplatesInSettings
		),
	};
} //end fixPostTypeInTemplates()

function fixNetworkSettings< G extends AutomationGroup >( group: G ): G {
	const expectedNetworks = uniq(
		map( values( group?.profileSettings ), 'network' )
	).filter( ( n ) => doesNetworkSupport( 'network-template', n ) );
	const actualNetworks = keys( group?.networkSettings );

	if (
		expectedNetworks.length ===
		intersection( expectedNetworks, actualNetworks ).length
	) {
		return group;
	} //end if

	return {
		...group,
		networkSettings: keyBy(
			map(
				expectedNetworks,
				( name ): NetworkAutomationSettings => ( {
					name,
					...NETWORK_SETTINGS,
					...group?.networkSettings[ name ],
				} )
			),
			'name'
		),
	};
} //end fixNetworkSettings()

function disableAutoSharesIfNoTemplates< G extends AutomationGroup >(
	group: G
): G {
	const hasPublicationTemplates = ( n: SocialNetworkName ) =>
		!! group.networkSettings[ n ]?.publication.templates.length;

	const hasReshareTemplates = ( n: SocialNetworkName ) =>
		!! group.networkSettings[ n ]?.reshare.templates.length;

	return {
		...group,
		profileSettings: mapValues( group.profileSettings, ( ps ) => ( {
			...ps,
			publication: {
				...ps.publication,
				enabled:
					ps.publication.enabled &&
					( !! ps.publication.templates.length ||
						hasPublicationTemplates( ps.network ) ),
			},
			reshare: {
				...ps.reshare,
				enabled:
					ps.reshare.enabled &&
					( !! ps.reshare.templates.length ||
						hasReshareTemplates( ps.network ) ),
			},
		} ) ),
	};
} //end disableAutoSharesIfNoTemplates()

// ====
// DATA
// ====

const NETWORK_SETTINGS: Omit< NetworkAutomationSettings, 'name' > = {
	publication: { templates: [] },
	reshare: { templates: [] },
};
