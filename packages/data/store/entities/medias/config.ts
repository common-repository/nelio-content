/**
 * External dependencies
 */
import type { MediaId, MediaItem } from '@nelio-content/types';

export type State = Record< MediaId, MediaItem >;
export const INIT: State = {};
