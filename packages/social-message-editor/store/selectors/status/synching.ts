/**
 * Internal dependencies
 */
import type { RelatedPostStatus, State } from '../../types';

export function getRelatedPostStatus( state: State ): RelatedPostStatus {
	return state.status.relatedPostStatus;
} //end getRelatedPostStatus()

export function isSaving( state: State ): boolean {
	return !! state.status.isSaving;
} //end isSaving()
