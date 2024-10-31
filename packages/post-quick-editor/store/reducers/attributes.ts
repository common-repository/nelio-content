/**
 * External dependencies
 */
import { orderBy, padStart } from 'lodash';
import { date } from '@nelio-content/date';
import type {
	AnyAction,
	EditorialTask,
	NewPost,
	Post,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE as FULL_INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { AttributeAction } from '../actions/attributes';
import type { OpenEditor } from '../actions/status';

type State = FullState[ 'attributes' ];
type Action = AttributeAction | OpenEditor;

const INIT_STATE = FULL_INIT_STATE.attributes;

export function attributes( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end attributes()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'OPEN_EDITOR':
			return {
				...INIT_STATE,
				id: ! isNewPost( action.post ) ? action.post.id : undefined,
				title: action.post.title ?? INIT_STATE.title,
				type: action.post.type ?? INIT_STATE.type,
				taxonomies: isNewPost( action.post )
					? INIT_STATE.taxonomies
					: action.post.taxonomies,
				authorId: action.post.author ?? INIT_STATE.authorId,
				status: isNewPost( action.post )
					? INIT_STATE.status
					: action.post.status,
				dateValue:
					! isNewPost( action.post ) && action.post.date
						? date( 'Y-m-d', action.post.date )
						: stringify(
								isNewPost( action.post )
									? action.post.dateValue
									: ''
						  ),
				timeValue:
					! isNewPost( action.post ) && action.post.date
						? date( 'H:i', action.post.date )
						: stringify(
								isNewPost( action.post )
									? action.post.timeValue
									: ''
						  ),
			};

		case 'SET_TITLE':
			return {
				...state,
				title: action.title,
			};

		case 'SET_POST_TYPE':
			return {
				...state,
				type: action.postType,
			};

		case 'SET_POST_STATUS':
			return {
				...state,
				status: action.postStatus,
			};

		case 'SET_POST_TERMS':
			return {
				...state,
				taxonomies: {
					...state.taxonomies,
					[ action.taxonomy ]: action.terms,
				},
			};

		case 'SET_AUTHOR':
			return {
				...state,
				authorId: action.authorId,
			};

		case 'SET_DATE':
			return {
				...state,
				dateValue: stringify( action.dateValue ),
			};

		case 'SET_TIME':
			return {
				...state,
				timeValue: stringify( action.timeValue ),
			};

		case 'SET_PREMIUM_ITEMS':
			return {
				...state,
				premiumItemsByType: {
					...state.premiumItemsByType,
					[ action.typeName ]: action.items,
				},
			};

		case 'SET_TASKS':
			return {
				...state,
				tasks: orderTasks( action.tasks ),
			};

		case 'SET_REFERENCE_INPUT':
			return {
				...state,
				referenceInput: action.url,
			};

		case 'SET_REFERENCES':
			return {
				...state,
				references: action.references,
			};

		case 'SET_NEW_COMMENTS':
			return {
				...state,
				newComments: action.comments,
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

const isNewPost = ( p: NewPost | Post ): p is NewPost =>
	! ( 'id' in p ) || ! p.id;

function stringify( value?: string ) {
	return undefined === value ? '' : `${ value }`;
} //end stringify()

const orderTasks = (
	ts: ReadonlyArray< EditorialTask >
): ReadonlyArray< EditorialTask > => orderBy( ts.map( mksort ), '_sort' );

const mksort = ( t: EditorialTask ): EditorialTask & { _sort: string } => {
	let sort = '';

	if ( t.dateType === 'exact' ) {
		sort += '0:' + t.dateValue;
	} else {
		const days = Math.abs( Number.parseInt( t.dateValue ) || 0 );
		sort +=
			t.dateType === 'positive-days' || 0 === days
				? '2:' + padStart( `${ days }`, 5, '0' )
				: '1:' + padStart( `${ Math.abs( 9999 - days ) }`, 5, '0' );
		sort += ':';
		sort += t.task;
	} //end if

	sort += `:${ t.task }:${ t.id }`;

	return { ...t, _sort: sort };
};
