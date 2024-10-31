/**
 * External dependencies
 */
import type {
	Maybe,
	SharedLink,
	SharedLinkStatus,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getSharedLinkData(
	state: State,
	url: Url
): Maybe< SharedLink > {
	const info = state.entities.sharedLinks[ url ];
	if ( ! info || 'ready' !== info.status ) {
		return;
	} //end if
	return info.data;
} //end getSharedLinkData()

export function getSharedLinkStatus(
	state: State,
	url: Url
): Maybe< SharedLinkStatus > {
	return state.entities.sharedLinks[ url ]?.status;
} //end getSharedLinkStatus()
