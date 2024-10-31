/**
 * External dependencies
 */
import type { Feed, FeedId } from '@nelio-content/types';

export type State = Record< FeedId, Feed >;

export const INIT: State = {};
