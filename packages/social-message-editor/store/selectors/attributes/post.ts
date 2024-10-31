/**
 * External dependencies
 */
import type { Maybe, Post, PostId, PostTypeName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getPost( state: State ): Maybe< Post > {
	return state.attributes.relatedPost;
} //end getPost()

export function getPostId( state: State ): Maybe< PostId > {
	return state.attributes.relatedPost?.id;
} //end getPostId()

export function getPostType( state: State ): Maybe< PostTypeName > {
	return state.attributes.relatedPost?.type;
} //end getPostType()
