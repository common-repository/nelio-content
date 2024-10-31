/**
 * External dependencies
 */
import type {
	OverwriteableQueryArg,
	RegularQueryArg,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

type ProfileSettings = State[ 'profileEditor' ][ 'settings' ];

export type ProfileEditorAction =
	| OpenProfileEditor
	| CloseProfileEditor
	| MarkAsSavingProfileSettings
	| SetEditingEmail
	| SetEditingQueryArgs;

export function openProfileEditor(
	profileId: Uuid,
	settings: ProfileSettings
): OpenProfileEditor {
	return {
		type: 'OPEN_PROFILE_EDITOR',
		profileId,
		settings,
	};
} //end openProfileSettings()

export function closeProfileEditor(): CloseProfileEditor {
	return {
		type: 'CLOSE_PROFILE_EDITOR',
	};
} //end closeProfileEditor()

export function setEditingEmail( email: string ): SetEditingEmail {
	return {
		type: 'SET_EDITING_EMAIL',
		email,
	};
} //end setEditingEmail()

export function setEditingQueryArgs(
	args: ReadonlyArray< RegularQueryArg | OverwriteableQueryArg >
): SetEditingQueryArgs {
	return {
		type: 'SET_EDITING_QUERY_ARGS',
		args,
	};
} //end setEditingQueryArgs()

export function markAsSavingProfileSettings(
	saving: boolean
): MarkAsSavingProfileSettings {
	return {
		type: 'MARK_AS_SAVING_PROFILE_SETTINGS',
		saving,
	};
} //end markAsSavingProfileSettings()

// ============
// HELPER TYPES
// ============

type OpenProfileEditor = {
	readonly type: 'OPEN_PROFILE_EDITOR';
	readonly profileId: Uuid;
	readonly settings: ProfileSettings;
};

type CloseProfileEditor = {
	readonly type: 'CLOSE_PROFILE_EDITOR';
};

type MarkAsSavingProfileSettings = {
	readonly type: 'MARK_AS_SAVING_PROFILE_SETTINGS';
	readonly saving: boolean;
};

type SetEditingEmail = {
	readonly type: 'SET_EDITING_EMAIL';
	readonly email: string;
};

type SetEditingQueryArgs = {
	readonly type: 'SET_EDITING_QUERY_ARGS';
	readonly args: ReadonlyArray< RegularQueryArg | OverwriteableQueryArg >;
};
