/**
 * External dependencies
 */
import { values } from 'lodash';
import type {
	BoardPostSummary,
	Maybe,
	PostId,
	PostStatusSlug,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../config';

export function getPostsInStatus(
	state: State,
	status: PostStatusSlug
): ReadonlyArray< BoardPostSummary > {
	return state.board.statuses[ status ] ?? [];
} //end getPostsInStatus()

export function getBoardPostSummary(
	state: State,
	id: PostId
): Maybe< BoardPostSummary > {
	return values( state.board.statuses )
		.flatMap( ( p ) => p )
		.find( ( p ) => p.id === id );
} //end getBoardPostSummary()
