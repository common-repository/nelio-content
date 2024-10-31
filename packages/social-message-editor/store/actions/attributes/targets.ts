/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type {
	Maybe,
	SocialNetworkName,
	SocialTargetName,
	Uuid,
} from '@nelio-content/types';

export type TargetAction =
	| SelectSingleTargetAction
	| SetSelectedTargetsInProfileAction;

export function selectSingleTarget(
	profileId: Uuid,
	targetName: SocialTargetName
): Maybe< SelectSingleTargetAction > {
	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	return {
		type: 'SELECT_SINGLE_TARGET',
		profileId,
		network: profile.network,
		targetName,
	};
} //end selectSingleTarget()

export function setSelectedTargetsInProfile(
	profileId: Uuid,
	selectedTargetNames: ReadonlyArray< string >
): Maybe< SetSelectedTargetsInProfileAction > {
	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	return {
		type: 'SET_SELECTED_TARGETS_IN_PROFILE',
		profileId,
		network: profile.network,
		selectedTargetNames,
	};
} //end setSelectedTargetsInProfile()

// ============
// HELPER TYPES
// ============

type SelectSingleTargetAction = {
	readonly type: 'SELECT_SINGLE_TARGET';
	readonly profileId: Uuid;
	readonly network: SocialNetworkName;
	readonly targetName: SocialTargetName;
};

export type SetSelectedTargetsInProfileAction = {
	readonly type: 'SET_SELECTED_TARGETS_IN_PROFILE';
	readonly profileId: Uuid;
	readonly network: SocialNetworkName;
	readonly selectedTargetNames: ReadonlyArray< string >;
};
