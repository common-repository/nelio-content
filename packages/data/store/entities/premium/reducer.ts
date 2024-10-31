/**
 * External dependencies
 */
import { keyBy, omit } from 'lodash';
import { createPremiumItemSummary, isDefined } from '@nelio-content/utils';
import type {
	AnyAction,
	PostId,
	PremiumItemSummary,
} from '@nelio-content/types';
/**
 * Internal dependencies
 */
import { INIT } from './config';
import { groupByRelatedPost, removeFromRelatedPost } from '../helpers';
import type { State } from './config';
import type { PremiumItemAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_PREMIUM_ITEMS': {
			return {
				...state,
				[ action.typeName ]: {
					...state[ action.typeName ],
					byId: {
						...state[ action.typeName ]?.byId,
						...keyBy( action.items, 'id' ),
					},
					byRelatedPost: groupByRelatedPost(
						state[ action.typeName ]?.byRelatedPost ?? {},
						action.items
							.map( ( c ) =>
								createPremiumItemSummary( action.typeName, c )
							)
							.filter( isDefined )
					),
				},
			};
		} //end case

		case 'REMOVE_PREMIUM_ITEM': {
			return {
				...state,
				[ action.typeName ]: {
					...state[ action.typeName ],
					byId: omit( state[ action.typeName ]?.byId, action.itemId ),
					byRelatedPost: removeFromRelatedPost(
						( state[ action.typeName ]?.byRelatedPost ??
							{} ) as Record<
							PostId,
							ReadonlyArray< PremiumItemSummary >
						>,
						action.itemId
					),
				},
			};
		} //end case
	} //end switch
} //end actualReducer()
