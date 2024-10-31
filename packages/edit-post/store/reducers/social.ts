/**
 * External dependencies
 */
import { without } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { SocialAction } from '../actions/social';
import type { MarkAsLoadingPostItems } from '../actions/post';

type Action = SocialAction | MarkAsLoadingPostItems;
type State = FullState[ 'social' ];

export function social( state = INIT_STATE.social, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end social()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MARK_SOCIAL_MESSAGE_AS_DELETING':
			return {
				...state,
				deleting: action.isDeleting
					? [ ...state.deleting, action.messageId ]
					: without( state.deleting, action.messageId ),
			};

		case 'MARK_TIMELINE_AS_GENERATING':
			return {
				...state,
				timelineStatus: action.isGenerating ? 'generating' : 'ready',
			};

		case 'MARK_TIMELINE_AS_CLEARING':
			return {
				...state,
				timelineStatus: action.isClearing ? 'clearing' : 'ready',
			};

		case 'MARK_AS_LOADING_POST_ITEMS':
			return {
				...state,
				isRetrievingSocialMessages: action.isLoading,
			};
	} //end switch
} //end actualReducer()
