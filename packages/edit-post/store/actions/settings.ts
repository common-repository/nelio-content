/**
 * Internal dependencies
 */
import type { AutoShareEndMode, Dict } from '@nelio-content/types';

export type SettingsAction =
	| SetPanelSettingsAction
	| TogglePanelAction
	| SetEditorToClassicAction
	| SetEditorToElementorAction
	| IncludeAuthorInFollowersAction
	| SetAutoShareEndModesAction;

export function setPanelSettings(
	settings: Dict< boolean >
): SetPanelSettingsAction {
	return {
		type: 'PANEL_SETTINGS',
		settings,
	};
} //end setPanelSettings()

export function togglePanel(
	panelName: string,
	isOpen: boolean
): TogglePanelAction {
	return {
		type: 'TOGGLE_PANEL',
		panelName,
		isOpen,
	};
} //end togglePanel()

export function setEditorToClassic(
	isClassicEditor: boolean
): SetEditorToClassicAction {
	return {
		type: 'SET_EDITOR_TO_CLASSIC',
		isClassicEditor,
	};
} //end setEditorToClassic()

export function setEditorToElementor(
	isElementorEditor: boolean
): SetEditorToElementorAction {
	return {
		type: 'SET_EDITOR_TO_ELEMENTOR',
		isElementorEditor,
	};
} //end setEditorToElementor()

export function includeAuthorInFollowers(
	shouldAuthorBeFollower: boolean
): IncludeAuthorInFollowersAction {
	return {
		type: 'INCLUDE_AUTHOR_IN_FOLLOWERS',
		shouldAuthorBeFollower,
	};
} //end includeAuthorInFollowers()

export function setAutoShareEndModes(
	autoShareEndModes: ReadonlyArray< AutoShareEndMode >
): SetAutoShareEndModesAction {
	return {
		type: 'SET_AUTO_SHARE_END_MODES',
		autoShareEndModes,
	};
} //end setAutoShareEndModes()

// ============
// HELPER TYPES
// ============

type SetPanelSettingsAction = {
	readonly type: 'PANEL_SETTINGS';
	readonly settings: Dict< boolean >;
};

type TogglePanelAction = {
	readonly type: 'TOGGLE_PANEL';
	readonly panelName: string;
	readonly isOpen: boolean;
};

type SetEditorToClassicAction = {
	readonly type: 'SET_EDITOR_TO_CLASSIC';
	readonly isClassicEditor: boolean;
};

type SetEditorToElementorAction = {
	readonly type: 'SET_EDITOR_TO_ELEMENTOR';
	readonly isElementorEditor: boolean;
};

type IncludeAuthorInFollowersAction = {
	readonly type: 'INCLUDE_AUTHOR_IN_FOLLOWERS';
	readonly shouldAuthorBeFollower: boolean;
};

type SetAutoShareEndModesAction = {
	readonly type: 'SET_AUTO_SHARE_END_MODES';
	readonly autoShareEndModes: ReadonlyArray< AutoShareEndMode >;
};
