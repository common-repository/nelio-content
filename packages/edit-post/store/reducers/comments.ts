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
import type { CommentsAction } from '../actions/comments';
import type { MarkAsLoadingPostItems } from '../actions/post';

type Action = CommentsAction | MarkAsLoadingPostItems;
type State = FullState[ 'comments' ];

export function comments(
	state = INIT_STATE.comments,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end comments()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_EDITORIAL_COMMENT_INPUT_VALUE':
			return {
				...state,
				input: action.value,
			};

		case 'MARK_EDITORIAL_COMMENT_AS_SYNCHING':
			return {
				...state,
				synching: action.isSynching
					? [ ...state.synching, action.commentId ]
					: without( state.synching, action.commentId ),
			};

		case 'MARK_EDITORIAL_COMMENT_AS_DELETING':
			return {
				...state,
				deleting: action.isDeleting
					? [ ...state.deleting, action.commentId ]
					: without( state.deleting, action.commentId ),
			};

		case 'MARK_AS_LOADING_POST_ITEMS':
			return {
				...state,
				isRetrievingComments: action.isLoading,
			};
	} //end switch
} //end actualReducer()
