/**
 * External references
 */
import { uniq, without } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { ReferencesAction } from '../actions/references';

type Action = ReferencesAction;
type State = FullState[ 'references' ];

export function references(
	state = INIT_STATE.references,
	action: AnyAction
): State {
	return actualReducer( state, action as Action ) ?? state;
} //end references()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'RECEIVE_REFERENCES':
			return {
				...state,
				byUrl: action.references.reduce(
					( byUrl, ref ) => ( {
						...byUrl,
						[ ref.url ]: {
							...byUrl[ ref.url ],
							...ref,
						},
					} ),
					state.byUrl
				),
			};

		case 'SET_SUGGESTED_REFERENCE_URL':
			return {
				...state,
				suggestedUrl: action.url,
			};

		case 'SUGGEST_REFERENCE':
			const suggested = state.byType.suggested;
			return {
				...state,
				byType: {
					...state.byType,
					suggested: suggested.includes( action.url )
						? suggested
						: [ ...suggested, action.url ],
				},
			};

		case 'SUGGEST_REFERENCES':
			return {
				...state,
				byType: {
					...state.byType,
					suggested: uniq( [
						...state.byType.suggested,
						...action.urls,
					] ),
				},
			};

		case 'DISCARD_REFERENCE':
			return {
				...state,
				byType: {
					...state.byType,
					suggested: without( state.byType.suggested, action.url ),
				},
			};

		case 'OPEN_REFERENCE_EDITOR':
			return {
				...state,
				editor: {
					isActive: true,
					reference: action.reference,
				},
			};

		case 'UPDATE_EDITING_REFERENCE':
			if ( ! state.editor.isActive ) {
				return state;
			} //end if
			return {
				...state,
				editor: {
					...state.editor,
					reference: {
						...state.editor.reference,
						...action.attributes,
					},
				},
			};

		case 'CLOSE_REFERENCE_EDITOR':
			return {
				...state,
				editor: { isActive: false },
			};

		case 'MARK_REFERENCE_AS_LOADING':
			return {
				...state,
				status: {
					...state.status,
					loading: action.isLoading
						? [ ...state.status.loading, action.referenceUrl ]
						: without( state.status.loading, action.referenceUrl ),
				},
			};

		case 'MARK_REFERENCE_AS_SAVING':
			return {
				...state,
				status: {
					...state.status,
					saving: action.isSaving
						? [ ...state.status.saving, action.referenceUrl ]
						: without( state.status.saving, action.referenceUrl ),
				},
			};
	} //end switch
} //end actualReducer()
