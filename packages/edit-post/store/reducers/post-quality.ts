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
import type { PostQualityAction } from '../actions/post-quality';
import type { QualityCheckTypesAction } from '../actions/quality-check-types';

type Action = PostQualityAction | QualityCheckTypesAction;
type State = FullState[ 'postQuality' ];

export function postQuality(
	state = INIT_STATE.postQuality,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end postQuality()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'ADD_QUALITY_CHECK_TYPE':
			return state;

		case 'UPDATE_QUALITY_CHECK_SETTINGS':
			return state;

		case 'REMOVE_QUALITY_CHECK_TYPE':
			return {
				...state,
				checks: omit( state.checks, action.name ),
			};

		case 'MARK_QUALITY_ANALYSIS_AS_FULLY_INTEGRATED':
			return {
				...state,
				isFullyIntegrated: action.isFullyIntegrated,
			};

		case 'UPDATE_QUALITY_CHECK_ITEM':
			return {
				...state,
				checks: {
					...state.checks,
					[ action.name ]: {
						status: action.status,
						text: action.text,
					},
				},
			};

		case 'SET_POST_QUALITY_SETTINGS':
			const settings = {
				allowedBads: state.settings.allowedBads,
				allowedImprovables: state.settings.allowedImprovables,
				unacceptableImprovables: state.settings.unacceptableImprovables,
				...action.settings,
			};
			return {
				...state,
				settings: {
					allowedBads: settings.allowedBads,
					allowedImprovables: settings.allowedImprovables,
					unacceptableImprovables: settings.unacceptableImprovables,
				},
			};
	} //end switch
} //end actualReducer()
