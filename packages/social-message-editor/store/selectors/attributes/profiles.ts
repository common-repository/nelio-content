/**
 * External dependencies
 */
import { keys } from 'lodash';
import { isEmpty } from '@nelio-content/utils';
import type { SocialNetworkName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getSelectedSocialProfiles(
	state: State
): ReadonlyArray< Uuid > {
	return state.attributes.profileIds.all || [];
} //end getSelectedSocialProfiles()

export function getSelectedSocialProfilesInNetwork(
	state: State,
	network: SocialNetworkName
): ReadonlyArray< Uuid > {
	return state.attributes.profileIds.byNetwork[ network ] || [];
} //end getSelectedSocialProfilesInNetwork()

export function getSelectedSocialNetworks(
	state: State
): ReadonlyArray< SocialNetworkName > {
	const networks = keys(
		state.attributes.profileIds.byNetwork
	) as ReadonlyArray< SocialNetworkName >;
	return networks.filter(
		( network ) =>
			! isEmpty( state.attributes.profileIds.byNetwork[ network ] )
	);
} //end getSelectedSocialNetworks()
