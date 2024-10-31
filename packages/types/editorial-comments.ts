/**
 * Internal dependencies
 */
import type { Uuid } from './utils';
import type { AuthorId, PostId, PostTypeName } from './wordpress-entities';

export type EditorialComment = {
	readonly id: Uuid;
	readonly authorId: AuthorId;
	readonly comment: string;
	readonly date: string;
	readonly postId: PostId;
	readonly postType: PostTypeName;
	readonly timezone: string;
};
