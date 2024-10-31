/**
 * External dependencies
 */
import { last } from 'lodash';
import type { Maybe, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getActiveSocialProfile( state: State ): Maybe< Uuid > {
	const activeNetwork = state.status.activeSocialNetwork;
	const profiles = state.attributes.profileIds.byNetwork[ activeNetwork ];
	return last( profiles );
} //end getActiveSocialProfile()

export function isPreviewVisible( state: State ): boolean {
	return !! state.status.isPreviewVisible;
} //end isPreviewVisible()
