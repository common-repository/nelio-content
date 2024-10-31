/**
 * External dependencies
 */
import type { Maybe, PostId } from '@nelio-content/types';

export type State = Partial< {
	readonly 'post-list/social-media-details': Maybe< PostId >;
} >;

export const INIT: State = {};
