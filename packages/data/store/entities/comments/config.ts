/**
 * External dependencies
 */
import type { EditorialComment, Uuid } from '@nelio-content/types';

export type State = Record< Uuid, EditorialComment >;

export const INIT: State = {};
