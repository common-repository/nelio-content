/**
 * Internal dependencies
 */
import type { ExtraInfoTab, State } from '../types';

export function isNewPost( state: State ): boolean {
	return ! state.attributes.id;
} //end isNewPost()

export function isPublished( state: State ): boolean {
	return !! state.status.isPublished;
} //end isPublished()

export function isVisible( state: State ): boolean {
	return !! state.status.isVisible;
} //end isVisible()

export function isSaving( state: State ): boolean {
	return !! state.status.isSaving;
} //end isSaving()

export function getExtraInfoTab( state: State ): ExtraInfoTab {
	return state.status.extraInfoTab || 'none';
} //end getExtraInfoTab()

export function getValidationError( state: State ): string {
	return state.status.error;
} //end getValidationError()
