/**
 * External dependencies
 */
import type { EditorialReference, Maybe, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getReferenceByUrl(
	state: State,
	referenceUrl: Url
): Maybe< EditorialReference > {
	return state.references.byUrl[ referenceUrl ];
} //end getReferenceByUrl()

export function getSuggestedReferences( state: State ): ReadonlyArray< Url > {
	return state.references.byType.suggested;
} //end getSuggestedReferences()

export function isReferenceLoading( state: State, referenceUrl: Url ): boolean {
	return (
		! state.references.byUrl[ referenceUrl ] ||
		state.references.status.loading.includes( referenceUrl )
	);
} //end isReferenceLoading()

export function isReferenceSaving( state: State, referenceUrl: Url ): boolean {
	return state.references.status.saving.includes( referenceUrl );
} //end isReferenceSaving()

export function isReferenceEditorVisible( state: State ): boolean {
	return state.references.editor.isActive;
} //end isReferenceEditorVisible()

export function getEditingReference(
	state: State
): Maybe< EditorialReference > {
	const { editor } = state.references;
	return editor.isActive ? editor.reference : undefined;
} //end getEditingReference()

export function getSuggestedReferenceUrl( state: State ): string {
	return state.references.suggestedUrl;
} //end getSuggestedReferenceUrl()
