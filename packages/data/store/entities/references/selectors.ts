/**
 * External dependencies
 */
import type { EditorialReference, PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getSuggestedReferences(
	state: State,
	postId?: PostId
): ReadonlyArray< EditorialReference > {
	return postId ? state.entities.references[ postId ] ?? [] : [];
} //end getSuggestedReferences()
