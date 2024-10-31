/**
 * EExternal dependencies
 */
import type { Maybe, SocialTargetName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getProfileIdInTargetSelector( state: State ): Maybe< Uuid > {
	return state.targetSelector.profileId || undefined;
} //end getProfileIdInTargetSelector()

export function getSelectedTargetsInTargetSelector(
	state: State
): ReadonlyArray< SocialTargetName > {
	return state.targetSelector.selectedTargetNames;
} //end getSelectedTargetsInTargetSelector()

export function isTargetSelectedInTargetSelector(
	state: State,
	targetName: SocialTargetName
): boolean {
	return state.targetSelector.selectedTargetNames.includes( targetName );
} //end isTargetSelectedInTargetSelector()

export function isTargetSelectorVisible( state: State ): boolean {
	return !! state.targetSelector.profileId;
} //end isTargetSelectorVisible()
