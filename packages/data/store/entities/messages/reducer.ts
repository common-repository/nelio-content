/**
 * External dependencies
 */
import { keyBy, omit, values } from 'lodash';
import { createItemSummary } from '@nelio-content/utils';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import { groupByRelatedPost, removeFromRelatedPost } from '../helpers';
import type { State } from './config';
import type { MessageAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_SOCIAL_MESSAGES':
			return {
				byId: {
					...state.byId,
					...keyBy( action.messages, 'id' ),
				},
				byRelatedPost: groupByRelatedPost(
					state.byRelatedPost,
					action.messages.map( ( c ) =>
						createItemSummary( 'social', c )
					)
				),
			};

		case 'REMOVE_RECURRING_MESSAGES': {
			if ( ! action.recurrenceGroup ) {
				return state;
			} //end if
			const removedIds = values( state.byId )
				.filter( ( m ) => m.recurrenceGroup === action.recurrenceGroup )
				.map( ( m ) => m.id );
			return {
				byId: omit( state.byId, removedIds ),
				byRelatedPost: removedIds.reduce(
					( r, id ) => removeFromRelatedPost( r, id ),
					state.byRelatedPost
				),
			};
		} //end case

		case 'REMOVE_SOCIAL_MESSAGE':
			return {
				byId: omit( state.byId, action.messageId ),
				byRelatedPost: removeFromRelatedPost(
					state.byRelatedPost,
					action.messageId
				),
			};
	} //end switch
} //end actualReducer()
