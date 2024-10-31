/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, SocialTargetName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../store';

export type TargetSelectorAction =
	| OpenTargetSelectorAction
	| CloseTargetSelectorAction
	| SelectTargetInTargetSelectorAction;

export function openTargetSelector(
	profileId: Uuid
): Maybe< OpenTargetSelectorAction > {
	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	const selectedTargetNames =
		select( NC_SOCIAL_EDITOR ).getSelectedTargetsInProfile( profileId );

	return {
		type: 'OPEN_TARGET_SELECTOR',
		profileId,
		selectedTargetNames,
	};
} //end openTargetSelector()

export function closeTargetSelector(): CloseTargetSelectorAction {
	return {
		type: 'CLOSE_TARGET_SELECTOR',
	};
} //end closeTargetSelector()

export function selectTargetInTargetSelector(
	targetName: SocialTargetName,
	isSelected: boolean
): SelectTargetInTargetSelectorAction {
	return {
		type: 'SELECT_TARGET_IN_TARGET_SELECTOR',
		targetName,
		isSelected,
	};
} //end selectTarget()

// ============
// HELPER TYPES
// ============

type OpenTargetSelectorAction = {
	readonly type: 'OPEN_TARGET_SELECTOR';
	readonly profileId: Uuid;
	readonly selectedTargetNames: ReadonlyArray< SocialTargetName >;
};

type CloseTargetSelectorAction = {
	readonly type: 'CLOSE_TARGET_SELECTOR';
};

type SelectTargetInTargetSelectorAction = {
	readonly type: 'SELECT_TARGET_IN_TARGET_SELECTOR';
	readonly targetName: SocialTargetName;
	readonly isSelected: boolean;
};
