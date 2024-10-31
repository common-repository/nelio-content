/**
 * External dependencies
 */
import { castArray } from 'lodash';
import type { Author } from '@nelio-content/types';

export type AuthorAction = ReceiveAuthorsAction;

export function receiveAuthors(
	authors: Author | ReadonlyArray< Author >
): ReceiveAuthorsAction {
	return {
		type: 'RECEIVE_AUTHORS',
		authors: castArray( authors ),
	};
} //end receiveAuthors()

// ============
// HELPER TYPES
// ============

type ReceiveAuthorsAction = {
	readonly type: 'RECEIVE_AUTHORS';
	readonly authors: ReadonlyArray< Author >;
};
