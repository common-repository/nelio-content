/**
 * External dependencies
 */
import { reduce } from 'lodash';
import type {
	AnyAction,
	SharedLink,
	SharedLinkStatus,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT } from './config';
import type { State } from './config';
import type { SharedLinkAction } from '../actions';
import type { PostAction } from '../posts/actions';

type Action = SharedLinkAction | PostAction;

type Entry = {
	readonly status: SharedLinkStatus;
	readonly data: SharedLink;
};

export function reducer( state = INIT, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end reducer()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'MARK_SHARED_LINK_AS_LOADING':
			return {
				...state,
				[ action.url ]: {
					status: 'loading',
				},
			};

		case 'MARK_SHARED_LINK_AS_ERROR':
			return {
				...state,
				[ action.url ]: {
					status: 'error',
				},
			};

		case 'RECEIVE_SHARED_LINK_DATA':
			return {
				...state,
				[ action.url ]: {
					status: 'ready',
					data: action.data,
				},
			};

		case 'RECEIVE_POSTS':
			return {
				...state,
				...reduce(
					action.posts,
					( r, post ) => ( {
						...r,
						[ post.permalink ]: {
							status: 'ready',
							data: {
								responseCode: 200,
								author: post.authorName,
								date: post.date || '',
								domain: getDomain( post.permalink ),
								email: '',
								excerpt: post.excerpt,
								image: post.imageSrc || '',
								permalink: post.permalink,
								title: post.title,
								twitter: '',
							},
						},
					} ),
					{} as Record< string, Entry >
				),
			};

		case 'REMOVE_POST':
			return state;
	} //end switch
} //end sharedLinks()

// =======
// HELPERS
// =======

const getDomain = ( link: Url ): string =>
	link.replace( /^https?:\/\//, '' ).split( '/' )[ 0 ] ?? '';
