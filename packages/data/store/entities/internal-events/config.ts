/**
 * External dependencies
 */
import type { InternalEvent, Uuid } from '@nelio-content/types';

export type State = Record< Uuid, InternalEvent >;

export const INIT: State = {};
