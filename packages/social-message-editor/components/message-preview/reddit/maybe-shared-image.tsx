/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSharedLinkAttributes } from '../../../hooks';

import { SharedLinkLoader } from '../shared-link-loader';

export const MaybeSharedImage = (): JSX.Element | null => {
	const { sharedLinkStatus, sharedLink: { image } = {} } =
		useSharedLinkAttributes( 'first' );

	switch ( sharedLinkStatus ) {
		case 'loading':
			return <SharedLinkLoader />;

		case 'ready':
			if ( ! image ) {
				return null;
			} //end if

			return (
				<img
					className="nelio-content-social-message-reddit-preview__image"
					alt={ _x(
						'Featured image in shared link',
						'text',
						'nelio-content'
					) }
					src={ image }
				/>
			);

		default:
			return null;
	} //end switch
};
