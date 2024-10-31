/**
 * External dependencies
 */
import { find } from 'lodash';

/**
 * External dependencies
 */
import type {
	AutoShareEndModeId,
	AutoShareEndMode,
	Dict,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function isClassicEditor( state: State ): boolean {
	return state.settings.isClassicEditor;
} //end isClassicEditor()

export function isElementorEditor( state: State ): boolean {
	return state.settings.isElementorEditor;
} //end isElementorEditor()

export function getPanelStatuses( state: State ): Dict< boolean > {
	return state.settings.panels;
} //end getPanelStatuses()

export function isPanelOpen( state: State, panelName: string ): boolean {
	const isOpen = state.settings.panels[ panelName ];
	return undefined === isOpen ? true : isOpen;
} //end isPanelOpen()

export function shouldAuthorBeFollower( state: State ): boolean {
	return state.settings.shouldAuthorBeFollower;
} //end shouldAuthorBeFollower()

export function getAutoShareEndModes(
	state: State
): ReadonlyArray< AutoShareEndMode > {
	return state.settings.autoShareEndModes;
} //end getAutoShareEndModes()

export function getAutoShareEndModeDuration(
	state: State,
	endMode: AutoShareEndModeId
): number {
	const mode = find( state.settings.autoShareEndModes, { value: endMode } );
	return mode?.months || 0;
} //end getAutoShareEndModeDuration()
