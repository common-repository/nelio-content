/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, SocialNetworkName, Uuid } from '@nelio-content/types';

export type ProfileAction =
	| SelectSingleSocialProfileAction
	| SelectSocialProfileAction;

export function selectSingleSocialProfile(
	profileId: Uuid
): Maybe< SelectSingleSocialProfileAction > {
	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	return {
		type: 'SELECT_SINGLE_SOCIAL_PROFILE',
		profileId,
		network: profile.network,
	};
} //end selectSingleSocialProfile()

export function selectSocialProfile(
	profileId: Uuid,
	isSelected: boolean
): Maybe< SelectSocialProfileAction > {
	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	return {
		type: 'SELECT_SOCIAL_PROFILE',
		profileId,
		network: profile.network,
		isSelected,
	};
} //end selectSocialProfile()

// ============
// HELPER TYPES
// ============

export type SelectSingleSocialProfileAction = {
	readonly type: 'SELECT_SINGLE_SOCIAL_PROFILE';
	readonly profileId: Uuid;
	readonly network: SocialNetworkName;
};

type SelectSocialProfileAction = {
	readonly type: 'SELECT_SOCIAL_PROFILE';
	readonly profileId: Uuid;
	readonly network: SocialNetworkName;
	readonly isSelected: boolean;
};
