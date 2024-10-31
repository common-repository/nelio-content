/**
 * External dependencies
 */
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { AttributeAction } from '../actions/attributes';
import type { OpenEditorAction } from '../actions/status';

type State = FullState[ 'attributes' ];
type Action = AttributeAction | OpenEditorAction;

export function attributes(
	state = INIT_STATE.attributes,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end attributes()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EDITOR':
			return {
				...INIT_STATE.attributes,
				...action.task,
			};

		case 'SET_TASK':
			return {
				...state,
				task: action.task,
			};

		case 'SET_ASSIGNEE_ID':
			return {
				...state,
				assigneeId: action.assigneeId,
			};

		case 'SET_DATE_TYPE':
			return {
				...state,
				dateType: action.dateType,
			};

		case 'SET_DATE_VALUE':
			return {
				...state,
				dateValue: stringify( action.dateValue ),
			};

		case 'SET_COLOR':
			return {
				...state,
				color: action.color,
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function stringify( value?: string ) {
	return undefined === value ? '' : `${ value }`;
} //end stringify()
