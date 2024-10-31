/**
 * External dependencies
 */
import moment from 'moment';
import { find, without } from 'lodash';
import { date } from '@nelio-content/date';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { Period, State, UpdatingItemSummary } from './config';
import type { StatusAction as Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MARK_AS_UPDATING':
			return {
				...state,
				updating: addItem( state.updating, action.item ),
			};

		case 'MARK_AS_UPDATED':
			return {
				...state,
				updating: removeItem( state.updating, action.item ),
			};

		case 'MARK_PERIOD_AS_LOADING':
			return {
				...state,
				updating: addItem( state.updating, action.period ),
			};

		case 'MARK_PERIOD_AS_LOADED':
			return {
				...state,
				loadedDays: markPeriodAsLoaded(
					state.loadedDays,
					action.period.firstDay,
					action.period.lastDay
				),
				updating: removeItem( state.updating, action.period ),
			};

		case 'SET_LOADER_TIMEOUT':
			return {
				...state,
				loaderTimeout: action.timeout,
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function addItem(
	state: State[ 'updating' ],
	item: UpdatingItemSummary | Period
): State[ 'updating' ] {
	if ( find( state, { type: item.type, id: item.id } ) ) {
		return state;
	} //end if

	return [ ...state, item ];
} //end addItem()

function removeItem(
	state: State[ 'updating' ],
	item: UpdatingItemSummary | Period
): State[ 'updating' ] {
	const itemInState = find(
		state,
		( c ) => c.type === item.type && c.id === item.id
	);
	if ( ! itemInState ) {
		return state;
	} //end if

	return without( state, itemInState );
} //end removeItem()

function markPeriodAsLoaded(
	state: State[ 'loadedDays' ],
	firstDay: string,
	lastDay: string
): State[ 'loadedDays' ] {
	let day;
	const dayMoment = moment( firstDay );
	do {
		day = date( 'Y-m-d', dayMoment );
		state = {
			...state,
			[ day ]: true,
		};
		dayMoment.add( 1, 'day' );
	} while ( day <= lastDay );
	return state;
} //end markPeriodAsLoaded()
