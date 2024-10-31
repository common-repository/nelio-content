/**
 * External dependencies
 */
import type { SocialNetworkName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { EditorContext, State } from '../../types';

export function getActiveSocialNetwork( state: State ): SocialNetworkName {
	return state.status.activeSocialNetwork;
} //end getActiveSocialNetwork()

export function getEditorContext( state: State ): EditorContext {
	return state.status.context;
} //end getEditorContext()

export function getValidationError( state: State ): string {
	return state.status.error;
} //end getValidationError()

export function isNewMessage( state: State ): boolean {
	return ! state.attributes.message.id;
} //end isNewMessage()

export function getDisabledProfileIds( state: State ): ReadonlyArray< Uuid > {
	return state.status.disabledProfileIds;
} //end getDisabledProfileIds()

export function isEditorVisible( state: State ): boolean {
	return state.status.isVisible;
} //end isEditorVisible()

export function isImageUrlSelectorVisible( state: State ): boolean {
	return isEditorVisible( state ) && state.status.isImageUrlSelectorVisible;
} //end isImageUrlSelectorVisible()
