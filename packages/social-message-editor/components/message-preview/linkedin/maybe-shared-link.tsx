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

export const MaybeSharedLink = (): JSX.Element | null => {
	const { sharedLinkStatus, sharedLink: { domain, image, title } = {} } =
		useSharedLinkAttributes( 'first' );

	switch ( sharedLinkStatus ) {
		case 'loading':
			return <SharedLinkLoader />;

		case 'no-url':
		case 'ready':
			return (
				<div className="nelio-content-linkedin-shared-link">
					{ !! image ? (
						<img
							className="nelio-content-linkedin-shared-link__image"
							alt={ _x(
								'Featured image in shared link',
								'text',
								'nelio-content'
							) }
							src={ image }
						/>
					) : (
						<br />
					) }

					<div className="nelio-content-linkedin-shared-link__content">
						<div className="nelio-content-linkedin-shared-link__title">
							{ title }
						</div>

						<div className="nelio-content-linkedin-shared-link__signature">
							{ domain }
						</div>
					</div>
				</div>
			);

		default:
			return null;
	} //end switch
};
