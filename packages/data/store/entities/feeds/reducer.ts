/**
 * External dependencies
 */
import { keyBy, omit, keys, partition } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { FeedAction as Action } from './actions';

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_FEEDS': {
			const ids = keys( state );
			const [ newFeeds, oldFeeds ] = partition(
				action.feeds,
				( { id } ) => ! ids.includes( id )
			);

			return {
				...keyBy( newFeeds, 'id' ),
				...state,
				...keyBy( oldFeeds, 'id' ),
			};
		} //end case

		case 'REMOVE_FEED':
			return omit( state, action.id );
	} //end switch
} //end actualReducer()
