/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter, intersection, map, uniq } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { doesNetworkSupport } from '@nelio-content/networks';
import type {
	SocialNetworkName,
	SocialNetworkSupport,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export const useActiveSocialNetwork = (): SocialNetworkName =>
	useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getActiveSocialNetwork()
	);

export const useDoesActiveNetworkSupport = (
	support: SocialNetworkSupport
): boolean => doesNetworkSupport( support, useActiveSocialNetwork() );

export const useAvailableNetworks = (): ReadonlyArray< SocialNetworkName > =>
	useSelect( ( select ) => {
		const { getAvailableSocialNetworks, isSubscribed } = select( NC_DATA );
		const networks = getAvailableSocialNetworks();
		if ( isSubscribed() ) {
			return networks;
		} //end if

		const { getSocialProfiles } = select( NC_DATA );
		const profiles = getSocialProfiles();

		const { getDisabledProfileIds } = select( NC_SOCIAL_EDITOR );
		const disabledProfiles = getDisabledProfileIds();

		const availableProfiles = filter(
			profiles,
			( { id } ) => ! disabledProfiles.includes( id )
		);
		const availableNetworks = uniq( map( availableProfiles, 'network' ) );
		return intersection( networks, availableNetworks );
	} );

export const useSelectedNetworks = (): ReadonlyArray< SocialNetworkName > =>
	useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getSelectedSocialNetworks()
	);

export const useActiveNetwork = (): [
	SocialNetworkName,
	( network: SocialNetworkName ) => void,
] => {
	const network = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getActiveSocialNetwork()
	);
	const { setActiveSocialNetwork } = useDispatch( NC_SOCIAL_EDITOR );
	return [ network, setActiveSocialNetwork ];
};
