/**
 * External dependencies
 */
import type {
	EditorialComment,
	Maybe,
	PostId,
	Uuid,
} from '@nelio-content/types';
import { isDefined } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getComment(
	state: State,
	id?: Uuid
): Maybe< EditorialComment > {
	return id ? state.entities.comments[ id ] : undefined;
} //end getComment()

export function getCommentsRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< EditorialComment > {
	return getCommentIdsRelatedToPost( state, postId )
		.map( ( id ) => getComment( state, id ) )
		.filter( isDefined );
} //end getCommentsRelatedToPost()

export function getCommentIdsRelatedToPost(
	state: State,
	postId?: PostId
): ReadonlyArray< Uuid > {
	return Object.values( state.entities.comments )
		.filter( ( c ) => ! postId || c.postId === postId )
		.map( ( c ) => c.id );
} //end getCommentIdsRelatedToPost()
