/**
 * External dependencies
 */
import type { Post, PostId } from '@nelio-content/types';

export type State = Record< PostId, Post >;

export const INIT: State = {};
