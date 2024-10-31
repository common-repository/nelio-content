/**
 * External dependencies
 */
import { omit } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { QualityCheckTypesAction as Action } from '../actions/quality-check-types';

type State = FullState[ 'qualityCheckTypes' ];

export function qualityCheckTypes(
	state = INIT_STATE.qualityCheckTypes,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end qualityCheckTypes()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_QUALITY_CHECK_TYPE':
			return {
				...state,
				[ action.definition.name ]: action.definition,
			};

		case 'REMOVE_QUALITY_CHECK_TYPE':
			if ( ! state[ action.name ] ) {
				return state;
			} //end if
			return omit( state, action.name );

		case 'UPDATE_QUALITY_CHECK_SETTINGS': {
			const qualityCheck = state[ action.name ];
			if ( ! qualityCheck ) {
				return state;
			} //end if
			return {
				...state,
				[ action.name ]: {
					...qualityCheck,
					settings: {
						...qualityCheck.settings,
						...action.settings,
					},
				},
			};
		}
	} //end switch
} //end actualReducer()
