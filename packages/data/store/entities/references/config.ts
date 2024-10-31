/**
 * External dependencies
 */
import type { PostId, EditorialReference } from '@nelio-content/types';

export type State = Record< PostId, ReadonlyArray< EditorialReference > >;

export const INIT: State = {};
