/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { SocialProfile, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export const useAvailableProfiles = (): ReadonlyArray< SocialProfile > =>
	useSelect( ( select ) => {
		const { getDisabledProfileIds } = select( NC_SOCIAL_EDITOR );
		const disabledProfiles = getDisabledProfileIds();
		return filter(
			select( NC_DATA ).getSocialProfiles(),
			( { id } ) => ! disabledProfiles.includes( id )
		);
	} );

export const useSelectedProfiles = (): [
	ReadonlyArray< Uuid >,
	( profileId: Uuid ) => void,
] => {
	const profiles = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getSelectedSocialProfiles()
	);
	const { selectSocialProfile } = useDispatch( NC_SOCIAL_EDITOR );
	const toggleProfile = ( profileId: Uuid ) =>
		selectSocialProfile( profileId, ! profiles.includes( profileId ) );
	return [ profiles, toggleProfile ];
};
