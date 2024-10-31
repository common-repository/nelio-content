/**
 * External dependencies
 */
import { has, uniq } from 'lodash';
import { isUrl } from '@nelio-content/utils';
import type { AnyAction } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { INIT_STATE } from '../config';
import type { State as FullState } from '../types';
import type { PostAction as Action } from '../actions/post';

type State = FullState[ 'post' ];

export function post( state = INIT_STATE.post, action: AnyAction ): State {
	return actualReducer( state, action as Action ) ?? state;
} //end post()

function actualReducer( state: State, action: Action ): State {
	switch ( action.type ) {
		case 'SET_POST_ID':
			return state.id ? state : { ...state, id: state.id };

		case 'SET_POST': {
			const { imageSrc, ...p } = action.post;
			return {
				...INIT_STATE.post,
				...p,
				imageSrc: imageSrc || false,
				images: extractImages( p?.content ),
				automationSources: {
					...INIT_STATE.post.automationSources,
					...p?.automationSources,
				},
			};
		}

		case 'SET_QUERY_ARGS':
			return {
				...state,
				permalinkQueryArgs: action.args,
			};

		case 'SET_CUSTOM_FIELD':
			return {
				...state,
				customFields: has( state.customFields, action.key )
					? {
							...state.customFields,
							[ action.key ]: {
								...state.customFields[ action.key ],
								value: action.value,
							},
					  }
					: state.customFields,
			};

		case 'REMOVE_CUSTOM_FIELD':
			return {
				...state,
				customFields: has( state.customFields, action.key )
					? {
							...state.customFields,
							[ action.key ]: {
								...state.customFields[ action.key ],
								value: '',
							},
					  }
					: state.customFields,
			};

		case 'SET_TITLE':
			return {
				...state,
				title: action.title,
			};

		case 'SET_EXCERPT':
			return {
				...state,
				excerpt: action.excerpt,
			};

		case 'SET_CONTENT':
			return {
				...state,
				content: action.content,
				images: extractImages( action.content ),
			};

		case 'SET_DATE':
			return {
				...state,
				date: action.date ?? false,
			};

		case 'SET_AUTHOR':
			return {
				...state,
				author: action.authorId,
				authorName: action.authorName,
			};

		case 'SET_PERMALINK':
			return {
				...state,
				permalink: action.permalink,
			};

		case 'SET_FEATURED_IMAGE':
			return {
				...state,
				imageId: action.imageId,
				imageSrc: action.imageSrc,
				thumbnailSrc: action.thumbnailSrc,
			};

		case 'REMOVE_FEATURED_IMAGE':
			return {
				...state,
				imageId: 0,
				imageSrc: false,
				thumbnailSrc: false,
			};

		case 'SET_FOLLOWERS':
			return {
				...state,
				followers: action.followers,
			};

		case 'SET_STATUS':
			return {
				...state,
				status: action.status,
			};

		case 'SET_TERMS':
			return {
				...state,
				taxonomies: {
					...state.taxonomies,
					[ action.taxonomy ]: action.terms,
				},
			};

		case 'ENABLE_AUTO_SHARE':
			return {
				...state,
				isAutoShareEnabled: action.isAutoShareEnabled,
			};

		case 'SET_AUTO_SHARE_END_MODE':
			return {
				...state,
				autoShareEndMode: action.autoShareEndMode,
			};

		case 'SET_AUTOMATION_SOURCES':
			return {
				...state,
				automationSources: {
					...state.automationSources,
					...action.sources,
				},
			};

		case 'MARK_AS_LOADING_POST_ITEMS':
			return state;
	} //end switch
} //end actualReducer()

// =======
// HELPERS
// =======

function extractImages( content = '' ) {
	const matches =
		content.match( /img[^>]*src="[^"]+"|img[^>]*src='[^']+'/gi ) || [];
	return uniq(
		matches
			.map( ( img ) => img.replace( /.*src=.(.*)./, '$1' ) )
			.filter( isUrl )
	);
} //end extractImages()
