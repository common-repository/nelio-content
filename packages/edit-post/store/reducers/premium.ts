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
import type { PremiumAction as Action } from '../actions/premium';

type State = FullState[ 'premiumByType' ];

export function premiumByType(
	state = INIT_STATE.premiumByType,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end premiumByType()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MARK_PREMIUM_ITEM_AS_DELETING': {
			const deleting = state[ action.typeName ]?.deleting ?? [];
			return {
				...state,
				[ action.typeName ]: {
					...state[ action.typeName ],
					deleting: action.isDeleting
						? [ ...deleting, action.itemId ]
						: without( deleting, action.itemId ),
				},
			};
		} //end if
	} //end switch
} //end actualReducer()
