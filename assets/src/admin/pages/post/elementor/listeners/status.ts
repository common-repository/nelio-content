/**
 * External dependencies
 */
import type { Dict, PostStatusSlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isElementor, type Actions } from './types';

export function listenToStatus( { setStatus }: Actions ): void {
	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	let prevStatus: PostStatusSlug;
	elementor.settings.page.model.on( 'change:post_status', function ( model ) {
		const status = model.get( 'post_status' ) as PostStatusSlug;
		if ( prevStatus === status ) {
			return;
		} //end if
		prevStatus = status;

		void setStatus( status );
	} );
} //end listenToStatus()
