/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

export type ProfileListAction =
	| MarkAsBeingDeletedAction
	| MarkAsDeletedAction
	| MarkAsRefreshtingProfilesAction;

export function markAsBeingDeleted(
	profileId: Uuid
): MarkAsBeingDeletedAction {
	return {
		type: 'MARK_AS_BEING_DELETED',
		profileId,
	};
} //end markAsBeingDeleted()

export function markAsDeleted( profileId: Uuid ): MarkAsDeletedAction {
	return {
		type: 'MARK_AS_DELETED',
		profileId,
	};
} //end markAsDeleted()

export function markAsRefreshtingProfiles(
	isRefreshing: boolean
): MarkAsRefreshtingProfilesAction {
	return {
		type: 'MARK_AS_REFRESHING_PROFILES',
		isRefreshing,
	};
} //end markAsRefreshtingProfiles()

// ============
// HELPER TYPES
// ============

type MarkAsBeingDeletedAction = {
	readonly type: 'MARK_AS_BEING_DELETED';
	readonly profileId: Uuid;
};

type MarkAsDeletedAction = {
	readonly type: 'MARK_AS_DELETED';
	readonly profileId: Uuid;
};

type MarkAsRefreshtingProfilesAction = {
	readonly type: 'MARK_AS_REFRESHING_PROFILES';
	readonly isRefreshing: boolean;
};
