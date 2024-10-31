/**
 * External dependencies
 */
import { isRecurringMessage, isRecurringSource } from '@nelio-content/utils';
import type {
	AnyAction,
	Maybe,
	RecurrenceContext,
	SocialMessage,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { OpenEditorAction } from '../actions/status';
import type { RecurrenceAction } from '../actions/recurrence';

type State = FullState[ 'recurrence' ];
type Action = OpenEditorAction | RecurrenceAction;

export function recurrence(
	state = INIT_STATE.recurrence,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end recurrence()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EDITOR':
			return {
				...INIT_STATE.recurrence,
				mode: initialRecurrenceMode( action.message ),
				enabled:
					isExistingMessage( action.message ) &&
					isRecurringMessage( action.message ),
				settings:
					action.message.recurrenceSettings ??
					INIT_STATE.recurrence.settings,
			};

		case 'ENABLE_RECURRENCE':
			return {
				...state,
				enabled:
					state.mode === 'toggeable' ? action.enabled : state.enabled,
			};

		case 'EDIT_RECURRENCE_SETTINGS':
			return {
				...state,
				editing: state.mode !== 'locked' && action.editing,
			};

		case 'SET_RECURRENCE_SETTINGS':
			return {
				...state,
				settings:
					state.mode !== 'locked' ? action.settings : state.settings,
			};

		case 'SET_RECURRENCE_CONTEXT':
			return updateContext( action.context, state );
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function updateContext(
	partialContext: Partial< RecurrenceContext >,
	state: State
): State {
	const context: RecurrenceContext = { ...state.context, ...partialContext };

	switch ( state.settings.period ) {
		case 'day':
			return { ...state, context };

		case 'week': {
			const hadSingleDaySelected =
				Object.values( state.settings.weekdays ).filter( ( d ) => !! d )
					.length === 1;
			const wasContextDaySelected = state.settings.weekdays.includes(
				state.context.weekday
			);
			return hadSingleDaySelected && wasContextDaySelected
				? {
						...state,
						context,
						settings: {
							...state.settings,
							weekdays: [ context.weekday ],
						},
				  }
				: { ...state, context };
		}

		case 'month':
			if ( 'monthday' === state.settings.day ) {
				return {
					...state,
					context,
					settings: { ...state.settings, day: 'monthday' },
				};
			} //end if

			if (
				state.settings.day === 'last-weekday' &&
				context.weekindex.includes( 5 )
			) {
				return {
					...state,
					context,
					settings: {
						...state.settings,
						day: 'last-weekday',
					},
				};
			} //end if

			return {
				...state,
				context,
				settings: {
					...state.settings,
					day:
						context.weekindex[ 0 ] === 5
							? 'last-weekday'
							: 'nth-weekday',
				},
			};
	} //end switch
} //end updateContext()

// =======
// HELPERS
// =======

const isExistingMessage = (
	message: Maybe< OpenEditorAction[ 'message' ] >
): message is SocialMessage => !! message?.id;

const initialRecurrenceMode = (
	message: Maybe< OpenEditorAction[ 'message' ] >
): State[ 'mode' ] => {
	const isNewMessage = ! isExistingMessage( message );
	if ( isNewMessage ) {
		return 'toggeable';
	} //end if

	return isRecurringMessage( message ) && isRecurringSource( message )
		? 'editable'
		: 'locked';
};
