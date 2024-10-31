/**
 * External dependencies
 */
import type { Author, AuthorId } from '@nelio-content/types';

export type State = Record< AuthorId, Author >;

export const INIT: State = {};
