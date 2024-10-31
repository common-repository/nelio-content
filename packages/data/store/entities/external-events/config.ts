/**
 * External dependencies
 */
import type { ExternalEvent, Uuid } from '@nelio-content/types';

export type State = Record< Uuid, ExternalEvent >;

export const INIT: State = {};
