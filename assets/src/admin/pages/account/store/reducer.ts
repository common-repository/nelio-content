/**
 * External dependencies
 */
import { reject } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { Action } from './actions';
import type { State } from './types';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_ACCOUNT':
			return {
				...state,
				info: action.account,
				meta: {
					...state.meta,
					isAgencySummary:
						action.account.plan !== 'free' &&
						!! action.account.isAgency,
				},
			};

		case 'RECEIVE_PRODUCTS':
			return {
				...state,
				products: action.products,
			};

		case 'RECEIVE_SITES':
			return {
				...state,
				sites: action.sites,
			};

		case 'REMOVE_SITE':
			return {
				...state,
				sites: reject( state.sites, { id: action.siteId } ),
			};

		case 'RECEIVE_INVOICES':
			return {
				...state,
				invoices: action.invoices,
			};

		case 'OPEN_DIALOG':
			return {
				...state,
				meta: {
					...state.meta,
					dialog: action.dialogName,
				},
			};

		case 'CLOSE_DIALOG':
			return {
				...state,
				meta: {
					...state.meta,
					dialog: undefined,
				},
			};

		case 'ENABLE_AGENCY_FULL_VIEW':
			return {
				...state,
				meta: {
					...state.meta,
					isAgencySummary: false,
				},
			};

		case 'LOCK_PAGE':
			return {
				...state,
				meta: {
					...state.meta,
					lockReason: action.reason,
				},
			};

		case 'UNLOCK_PAGE':
			return {
				...state,
				meta: {
					...state.meta,
					lockReason: undefined,
				},
			};

		case 'SET_EDITING_LICENSE':
			return {
				...state,
				meta: {
					...state.meta,
					editingLicense: action.license,
				},
			};
	} //end switch
} //end actualReducer()
