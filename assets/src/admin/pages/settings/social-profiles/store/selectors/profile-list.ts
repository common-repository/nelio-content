/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function isProfileListRefreshing( state: State ): boolean {
	return !! state.profileList.isRefreshing;
} //end isProfileListRefreshing()

export function areThereProfilesBeingDeleted( state: State ): boolean {
	return ! isEmpty( state.profileList.deleting );
} //end areThereProfilesBeingDeleted()

export function isProfileBeingDeleted(
	state: State,
	profileId: Uuid
): boolean {
	return state.profileList.deleting.includes( profileId );
} //end isProfileBeingDeleted()
