/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { StatusAction } from '../actions/status';
import type { SelectSingleSocialProfileAction } from '../actions/attributes';

type Action = StatusAction | SelectSingleSocialProfileAction;
type State = FullState[ 'status' ];

export function status( state = INIT_STATE.status, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end status()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EDITOR':
			return {
				...INIT_STATE.status,
				activeSocialNetwork: action.activeSocialNetwork,
				context: action.context,
				disabledProfileIds: action.disabledProfileIds,
				isVisible: true,
				isPreviewVisible: action.isPreviewVisible,
				relatedPostStatus: action.post
					? { type: 'ready' }
					: { type: 'none' },
			};

		case 'CLOSE_EDITOR':
			return INIT_STATE.status;

		case 'SET_ACTIVE_SOCIAL_NETWORK':
			return {
				...state,
				activeSocialNetwork: action.network,
			};

		case 'SET_RELATED_POST_STATUS':
			return {
				...state,
				relatedPostStatus: action.status,
			};

		case 'SET_VALIDATION_ERROR':
			return {
				...state,
				error: action.error,
			};

		case 'MARK_AS_SAVING':
			return {
				...state,
				isSaving: !! action.isSaving,
			};

		case 'SHOW_IMAGE_URL_SELECTOR':
			return {
				...state,
				isImageUrlSelectorVisible: action.isVisible,
			};

		case 'SHOW_PREVIEW':
			return {
				...state,
				isPreviewVisible: action.isVisible,
			};

		case 'SELECT_SINGLE_SOCIAL_PROFILE':
			return {
				...state,
				activeSocialNetwork: action.network,
			};
	} //end switch
} //end actualReducer()
