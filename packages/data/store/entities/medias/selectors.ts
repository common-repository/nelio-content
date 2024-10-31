/**
 * External dependencies
 */
import type { Maybe, MediaId, MediaItem } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

export function getMedia( state: State, id?: MediaId ): Maybe< MediaItem > {
	return id ? state.entities.medias[ id ] : undefined;
} //end getMedia()
