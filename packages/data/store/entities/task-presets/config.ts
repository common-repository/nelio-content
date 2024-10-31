/**
 * External dependencies
 */
import type { TaskPreset } from '@nelio-content/types';

export type State = Record< TaskPreset[ 'id' ], TaskPreset >;

export const INIT: State = {};
