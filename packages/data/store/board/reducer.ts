/**
 * External dependencies
 */
import {
	filter,
	groupBy,
	map,
	mapValues,
	negate as not,
	pick,
	some,
	sortBy,
	values,
} from 'lodash';
import { hasHead } from '@nelio-content/utils';
import type { AnyAction, BoardPostSummary, Post } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';

import type { InitSiteSettings } from '../meta/site/actions';
import type { PostAction } from '../entities/posts/actions';

type Action = InitSiteSettings | PostAction;

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'INIT_SITE_SETTINGS':
			return {
				...state,
				validPostTypes:
					action.settings.postTypesByContext[ 'content-board' ],
			};

		case 'REMOVE_POST':
			return {
				...state,
				statuses: removePost( state.statuses, action.postId ),
			};

		case 'RECEIVE_POSTS':
			return {
				...state,
				statuses: addPosts(
					state.statuses,
					action.posts
						.filter( ( { type: pt } ) =>
							state.validPostTypes.includes( pt )
						)
						.map( createBoardPostSummary )
				),
			};
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function createBoardPostSummary( p: Post ): BoardPostSummary {
	return {
		id: p.id,
		author: p.author,
		date: p.date,
		sort: `${ p.date }:${ p.title }:${ p.id }`,
		status: p.status,
		type: p.type,
	};
} //end createBoardPostSummary()

function addPosts(
	state: State[ 'statuses' ],
	posts: ReadonlyArray< BoardPostSummary >
): State[ 'statuses' ] {
	if ( ! hasHead( posts ) ) {
		return state;
	} //end if

	// Remove old posts.
	state = posts.reduce( ( s, p ) => removePost( s, p.id ), state );

	// Add new posts.
	const statuses = map( posts, ( p ) => p.status );
	const existingPosts = values( pick( state, statuses ) ).flatMap(
		( p ) => p
	);
	state = {
		...state,
		...groupBy( [ ...posts, ...existingPosts ], 'status' ),
	};

	// Sort modified statuses.
	return mapValues( state, ( statusPosts, status ) =>
		statuses.includes( status )
			? sortBy( statusPosts, 'sort' )
			: statusPosts
	);
} //end addPosts()

function removePost(
	state: State[ 'statuses' ],
	id: BoardPostSummary[ 'id' ]
): State[ 'statuses' ] {
	const isPost = ( p: BoardPostSummary ) => p.id === id;
	return mapValues( state, ( posts ) =>
		some( posts, isPost ) ? filter( posts, not( isPost ) ) : posts
	);
} //end removePost()
