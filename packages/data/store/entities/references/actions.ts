/**
 * External dependencies
 */
import type { EditorialReference, PostId } from '@nelio-content/types';

export type ReferenceAction = ReceiveSuggestedReferencesAction;

export function receiveSuggestedReferences(
	postId: PostId,
	references: ReadonlyArray< EditorialReference >
): ReceiveSuggestedReferencesAction {
	return {
		type: 'RECEIVE_SUGGESTED_REFERENCES',
		postId,
		references,
	};
} //end receiveSuggestedReferences()

// ============
// HELPER TYPES
// ============

type ReceiveSuggestedReferencesAction = {
	readonly type: 'RECEIVE_SUGGESTED_REFERENCES';
	readonly postId: PostId;
	readonly references: ReadonlyArray< EditorialReference >;
};
