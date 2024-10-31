/**
 * External dependencies
 */
import type {
	Maybe,
	OverwriteableQueryArg,
	RegularQueryArg,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getEditingProfileId( state: State ): Maybe< Uuid > {
	return state.profileEditor.profileId;
} //end getEditingProfileId()

export function getEditingProfileSettings(
	state: State
): State[ 'profileEditor' ][ 'settings' ] {
	return state.profileEditor.settings;
} //end getEditingProfileSettings()

export function getEditingEmail( state: State ): string {
	return state.profileEditor.settings.email;
} //end getEditingEmail()

export function getEditingQueryArgs(
	state: State
): ReadonlyArray< RegularQueryArg | OverwriteableQueryArg > {
	return state.profileEditor.settings.permalinkQueryArgs;
} //end getEditingQueryArgs()

export function isSavingProfileSettings( state: State ): boolean {
	return state.profileEditor.isSaving;
} //end isSavingProfileSettings()
