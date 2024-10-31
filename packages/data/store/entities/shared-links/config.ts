/**
 * External dependencies
 */
import type { Url, SharedLink, SharedLinkStatus } from '@nelio-content/types';

export type State = Record< Url, SharedLinkInfo >;

export const INIT: State = {};

// ============
// HELPER TYPES
// ============

type SharedLinkInfo =
	| { status: Exclude< SharedLinkStatus, 'ready' > }
	| {
			readonly status: 'ready';
			readonly data: SharedLink;
	  };
