/**
 * Internal dependencies
 */
import type { Post } from './wordpress-entities';

export type BoardPostSummary = Pick<
	Post,
	'id' | 'type' | 'author' | 'status' | 'date'
> & {
	readonly sort: string;
};
