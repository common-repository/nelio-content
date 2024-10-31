/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { EfiAction as Action } from '../actions/external-featured-image';

type State = FullState[ 'externalFeaturedImage' ];

export function externalFeaturedImage(
	state = INIT_STATE.externalFeaturedImage,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end externalFeaturedImage()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_EXTERNAL_FEATURED_IMAGE':
			return {
				view: 'image',
				fields: {
					url: action.url,
					alt: action.altText,
				},
				imageUrl: action.url,
				imageAlt: action.altText,
			};

		case 'REMOVE_EXTERNAL_FEATURED_IMAGE':
			return {
				view: 'no-image',
				fields: {
					url: '',
					alt: '',
				},
				imageUrl: undefined,
				imageAlt: '',
			};

		case 'SET_EXTERNAL_FEATURED_IMAGE_URL_FIELD':
			return {
				...state,
				fields: {
					...state.fields,
					url: action.url,
				},
			};

		case 'SET_EXTERNAL_FEATURED_IMAGE_ALT_FIELD':
			return {
				...state,
				fields: {
					...state.fields,
					alt: action.altText,
				},
			};

		case 'EDIT_EXTERNAL_FEATURED_IMAGE':
			return {
				...state,
				view: 'edit-image',
			};

		case 'CANCEL_EDITION_OF_EXTERNAL_FEATURED_IMAGE':
			return {
				...state,
				view: !! state.imageUrl ? 'image' : 'no-image',
				fields: {
					url: state.imageUrl ?? '',
					alt: state.imageAlt,
				},
			};
	} //end switch
} //end actualReducer()
