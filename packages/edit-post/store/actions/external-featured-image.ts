/**
 * External dependencies
 */
import type { Url } from '@nelio-content/types';

export type EfiAction =
	| EditExternalFeaturedImageAction
	| CancelEditionOfExternalFeaturedImageAction
	| SetExternalFeaturedImageAction
	| RemoveExternalFeaturedImageAction
	| SetExternalFeaturedImageUrlFieldAction
	| SetExternalFeaturedImageAltFieldAction;

export function editExternalFeaturedImage(): EditExternalFeaturedImageAction {
	return {
		type: 'EDIT_EXTERNAL_FEATURED_IMAGE',
	};
} //end editExternalFeaturedImage()

export function cancelEditionOfExternalFeaturedImage(): CancelEditionOfExternalFeaturedImageAction {
	return {
		type: 'CANCEL_EDITION_OF_EXTERNAL_FEATURED_IMAGE',
	};
} //end cancelEditionOfExternalFeaturedImage()

export function setExternalFeaturedImage(
	url: Url,
	altText: string
): SetExternalFeaturedImageAction {
	return {
		type: 'SET_EXTERNAL_FEATURED_IMAGE',
		url,
		altText,
	};
} //end setExternalFeaturedImage()

export function removeExternalFeaturedImage(): RemoveExternalFeaturedImageAction {
	return {
		type: 'REMOVE_EXTERNAL_FEATURED_IMAGE',
	};
} //end removeExternalFeaturedImage()

export function setExternalFeaturedImageUrlField(
	url: Url
): SetExternalFeaturedImageUrlFieldAction {
	return {
		type: 'SET_EXTERNAL_FEATURED_IMAGE_URL_FIELD',
		url,
	};
} //end setExternalFeaturedImageUrlField()

export function setExternalFeaturedImageAltField(
	altText: string
): SetExternalFeaturedImageAltFieldAction {
	return {
		type: 'SET_EXTERNAL_FEATURED_IMAGE_ALT_FIELD',
		altText,
	};
} //end setExternalFeaturedImageAltField()

// ============
// HELPER TYPES
// ============

type EditExternalFeaturedImageAction = {
	readonly type: 'EDIT_EXTERNAL_FEATURED_IMAGE';
};

type CancelEditionOfExternalFeaturedImageAction = {
	readonly type: 'CANCEL_EDITION_OF_EXTERNAL_FEATURED_IMAGE';
};

type SetExternalFeaturedImageAction = {
	readonly type: 'SET_EXTERNAL_FEATURED_IMAGE';
	readonly url: Url;
	readonly altText: string;
};

type RemoveExternalFeaturedImageAction = {
	readonly type: 'REMOVE_EXTERNAL_FEATURED_IMAGE';
};

type SetExternalFeaturedImageUrlFieldAction = {
	readonly type: 'SET_EXTERNAL_FEATURED_IMAGE_URL_FIELD';
	readonly url: Url;
};

type SetExternalFeaturedImageAltFieldAction = {
	readonly type: 'SET_EXTERNAL_FEATURED_IMAGE_ALT_FIELD';
	readonly altText: string;
};
