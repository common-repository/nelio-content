/**
 * External dependencies
 */
import type { Maybe, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../types';

export function getExternalFeaturedImageView(
	state: State
): State[ 'externalFeaturedImage' ][ 'view' ] {
	return state.externalFeaturedImage.view;
} //end getExternalFeaturedImageView()

export function getExternalFeaturedImageUrl( state: State ): Maybe< Url > {
	return state.externalFeaturedImage.imageUrl;
} //end getExternalFeaturedImageUrl()

export function getExternalFeaturedImageAlt( state: State ): string {
	return state.externalFeaturedImage.imageAlt;
} //end getExternalFeaturedImageAlt()

export function getExternalFeaturedImageUrlField( state: State ): string {
	return state.externalFeaturedImage.fields.url;
} //end getExternalFeaturedImageUrlField()

export function getExternalFeaturedImageAltField( state: State ): string {
	return state.externalFeaturedImage.fields.alt;
} //end getExternalFeaturedImageAltField()
