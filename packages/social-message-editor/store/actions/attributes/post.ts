/**
 * External dependencies
 */
import type { Maybe, Post } from '@nelio-content/types';

export type PostAction = SetPostAction;

export function setPost( post: Maybe< Post > ): SetPostAction {
	return {
		type: 'SET_POST',
		post,
	};
} //end setPost()

// ============
// HELPER TYPES
// ============

type SetPostAction = {
	readonly type: 'SET_POST';
	readonly post: Maybe< Post >;
};
