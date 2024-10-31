/**
 * External dependencies
 */
import type { Author, AuthorId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getAuthor(
	state: State,
	authorId?: AuthorId
): Maybe< Author > {
	return authorId ? state.entities.authors[ authorId ] : undefined;
} //end getAuthor()
