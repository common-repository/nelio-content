/**
 * External dependencies
 */
import type { SocialTargetName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getSelectedTargets(
	state: State
): State[ 'attributes' ][ 'targetNamesByProfile' ] {
	return state.attributes.targetNamesByProfile;
} //end getSelectedTargets()

export function getSelectedTargetsInProfile(
	state: State,
	profileId: Uuid
): ReadonlyArray< SocialTargetName > {
	return state.attributes.targetNamesByProfile[ profileId ] || [];
} //end getSelectedTargetsInProfile()
