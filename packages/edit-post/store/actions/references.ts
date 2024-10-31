/**
 * External references
 */
import { castArray } from 'lodash';
import type { EditorialReference, Url } from '@nelio-content/types';

export type ReferencesAction =
	| OpenReferenceEditorAction
	| ReceiveReferencesAction
	| SetSuggestedReferenceUrlAction
	| SuggestReferenceAction
	| SuggestReferencesAction
	| DiscardReferenceAction
	| UpdateEditingReferenceAction
	| CloseReferenceEditorAction
	| MarkReferenceAsLoadingAction
	| MarkReferenceAsSavingAction;

export function receiveReferences(
	references: EditorialReference | ReadonlyArray< EditorialReference >
): ReceiveReferencesAction {
	return {
		type: 'RECEIVE_REFERENCES',
		references: castArray( references ),
	};
} //end receiveReferences()

export function setSuggestedReferenceUrl(
	url: string
): SetSuggestedReferenceUrlAction {
	return {
		type: 'SET_SUGGESTED_REFERENCE_URL',
		url,
	};
} //end setSuggestedReferenceUrl()

export function suggestReference( url: Url ): SuggestReferenceAction {
	return {
		type: 'SUGGEST_REFERENCE',
		url,
	};
} //end suggestReference()

export function suggestReferences(
	urls: Url | ReadonlyArray< Url >
): SuggestReferencesAction {
	return {
		type: 'SUGGEST_REFERENCES',
		urls: castArray( urls ),
	};
} //end suggestReferences()

export function discardReference( url: Url ): DiscardReferenceAction {
	return {
		type: 'DISCARD_REFERENCE',
		url,
	};
} //end discardReference()

export function updateEditingReference(
	attributes: Partial< EditorialReference >
): UpdateEditingReferenceAction {
	return {
		type: 'UPDATE_EDITING_REFERENCE',
		attributes,
	};
} //end updateEditingReference()

export function closeReferenceEditor(): CloseReferenceEditorAction {
	return {
		type: 'CLOSE_REFERENCE_EDITOR',
	};
} //end closeReferenceEditor()

export function markReferenceAsLoading(
	referenceUrl: Url,
	isLoading: boolean
): MarkReferenceAsLoadingAction {
	return {
		type: 'MARK_REFERENCE_AS_LOADING',
		referenceUrl,
		isLoading,
	};
} //end markReferenceAsLoading()

export function markReferenceAsSaving(
	referenceUrl: Url,
	isSaving: boolean
): MarkReferenceAsSavingAction {
	return {
		type: 'MARK_REFERENCE_AS_SAVING',
		referenceUrl,
		isSaving,
	};
} //end markReferenceAsSaving()

export function doOpenReferenceEditor(
	reference: EditorialReference
): OpenReferenceEditorAction {
	return {
		type: 'OPEN_REFERENCE_EDITOR',
		reference,
	};
}

// ============
// HELPER TYPES
// ============

type ReceiveReferencesAction = {
	readonly type: 'RECEIVE_REFERENCES';
	readonly references: ReadonlyArray< EditorialReference >;
};

type SetSuggestedReferenceUrlAction = {
	readonly type: 'SET_SUGGESTED_REFERENCE_URL';
	readonly url: string;
};

type SuggestReferenceAction = {
	readonly type: 'SUGGEST_REFERENCE';
	readonly url: Url;
};

type SuggestReferencesAction = {
	readonly type: 'SUGGEST_REFERENCES';
	readonly urls: ReadonlyArray< Url >;
};

type DiscardReferenceAction = {
	readonly type: 'DISCARD_REFERENCE';
	readonly url: Url;
};

type UpdateEditingReferenceAction = {
	readonly type: 'UPDATE_EDITING_REFERENCE';
	readonly attributes: Partial< EditorialReference >;
};

type CloseReferenceEditorAction = {
	readonly type: 'CLOSE_REFERENCE_EDITOR';
};

type MarkReferenceAsLoadingAction = {
	readonly type: 'MARK_REFERENCE_AS_LOADING';
	readonly referenceUrl: Url;
	readonly isLoading: boolean;
};

type MarkReferenceAsSavingAction = {
	readonly type: 'MARK_REFERENCE_AS_SAVING';
	readonly referenceUrl: Url;
	readonly isSaving: boolean;
};

type OpenReferenceEditorAction = {
	readonly type: 'OPEN_REFERENCE_EDITOR';
	readonly reference: EditorialReference;
};
