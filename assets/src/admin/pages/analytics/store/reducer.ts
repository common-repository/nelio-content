/**
 * External dependencies
 */
import { map, uniq, without } from 'lodash';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { stringifyCriteria } from './utils';
import { INIT_STATE } from './config';
import type { Action } from './actions';
import type { State } from './types';

export function reducer( state = INIT_STATE, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SORT_BY':
			return {
				...state,
				sortBy: action.criterion,
			};

		case 'SET_PERIOD_FILTER':
			return {
				...state,
				filters: {
					...state.filters,
					period: {
						mode: action.mode,
						value: action.value,
					},
				},
			};

		case 'SET_AUTHOR_FILTER':
			return {
				...state,
				filters: {
					...state.filters,
					author: action.author,
				},
			};

		case 'SET_POST_TYPE_FILTER':
			return {
				...state,
				filters: {
					...state.filters,
					postType: action.postType,
				},
			};

		case 'MARK_FILTER_CRITERIA_AS_LOADING':
			return {
				...state,
				status: {
					...state.status,
					loading: action.isLoading
						? uniq( [
								...state.status.loading,
								stringifyCriteria( action.criteria ),
						  ] )
						: without(
								state.status.loading,
								stringifyCriteria( action.criteria )
						  ),
				},
			};

		case 'UPDATE_FILTER_CRITERIA_PAGINATION':
			return {
				...state,
				status: {
					...state.status,
					pagination: {
						...state.status.pagination,
						[ stringifyCriteria( action.criteria ) ]:
							action.pagination,
					},
				},
			};

		case 'RECEIVE_POSTS_MATCHING_CRITERIA':
			const previousPosts =
				state.postsByCriteria[ stringifyCriteria( action.criteria ) ] ||
				[];
			return {
				...state,
				postsByCriteria: {
					...state.postsByCriteria,
					[ stringifyCriteria( action.criteria ) ]: [
						...previousPosts,
						...map( action.posts, 'id' ),
					],
				},
			};
	} //end switch
} //end actualReducer()
