/**
 * External dependencies
 */
import { keyBy, map, max, omit, without } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from './config';
import type { State } from './types';
import type { Action } from './actions';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RESET_TASK_PRESETS':
			return {
				...state,
				taskPresets: {
					byId: keyBy( action.presets, 'id' ),
					allIds: map( action.presets, 'id' ),
				},
			};

		case 'MARK_AS_SAVING':
			return {
				...state,
				saving: action.saving,
			};

		case 'CREATE_TASK_PRESET': {
			const ids = state.taskPresets.allIds.map( ( x ) => Math.abs( x ) );
			const id = -( ( max( ids ) || 0 ) + 1 );
			return {
				...state,
				taskPresets: {
					byId: {
						...state.taskPresets.byId,
						[ id ]: {
							id,
							name: '',
							tasks: [],
						},
					},
					allIds: [ ...state.taskPresets.allIds, id ],
				},
			};
		} //end case

		case 'SET_TASK_PRESET_NAME': {
			const preset = state.taskPresets.byId[ action.presetId ];
			if ( ! preset ) {
				return state;
			} //end if
			return {
				...state,
				taskPresets: {
					...state.taskPresets,
					byId: {
						...state.taskPresets.byId,
						[ preset.id ]: {
							...preset,
							name: action.name,
						},
					},
				},
			};
		} //end case

		case 'SET_TASK_TEMPLATES': {
			const preset = state.taskPresets.byId[ action.presetId ];
			if ( ! preset ) {
				return state;
			} //end if
			return {
				...state,
				taskPresets: {
					...state.taskPresets,
					byId: {
						...state.taskPresets.byId,
						[ preset.id ]: {
							...preset,
							tasks: action.templates,
						},
					},
				},
			};
		} //end case

		case 'REMOVE_TASK_PRESET':
			return {
				...state,
				taskPresets: {
					byId: omit( state.taskPresets.byId, action.presetId ),
					allIds: without(
						state.taskPresets.allIds,
						action.presetId
					),
				},
			};

		case 'OPEN_TASK_TEMPLATE_EDITOR':
			return {
				...state,
				editor: {
					presetId: action.presetId,
					source: action.task,
					attrs: action.task,
				},
			};

		case 'EDIT_TASK_TEMPLATE': {
			const editor = state.editor;
			if ( ! editor ) {
				return state;
			} //end if

			return {
				...state,
				editor: {
					...editor,
					attrs: { ...editor.attrs, ...action.task },
				},
			};
		} //end case

		case 'CLOSE_TASK_TEMPLATE_EDITOR':
			return {
				...state,
				editor: undefined,
			};
	} //end switch
} //end actualReducer()
