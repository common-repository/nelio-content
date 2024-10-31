/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSharedLinkAttributes } from '../../../hooks';

import { SharedLinkLoader } from '../shared-link-loader';

export const MaybeSharedLink = (): JSX.Element | null => {
	const {
		sharedLinkStatus,
		sharedLink: { title, excerpt, image, domain } = {},
	} = useSharedLinkAttributes( 'last' );

	switch ( sharedLinkStatus ) {
		case 'loading':
			return <SharedLinkLoader />;

		case 'ready':
			return (
				<div className="nelio-content-bluesky-shared-link">
					{ !! image && (
						<img
							className="nelio-content-bluesky-shared-link__image"
							alt={ _x(
								'Featured image in shared link',
								'text',
								'nelio-content'
							) }
							src={ image }
						/>
					) }

					<div className="nelio-content-bluesky-shared-link__content">
						<div className="nelio-content-bluesky-shared-link__domain">
							{ domain }
						</div>

						<div className="nelio-content-bluesky-shared-link__title">
							{ title }
						</div>

						{ !! excerpt && (
							<div className="nelio-content-bluesky-shared-link__excerpt">
								{ excerpt }
							</div>
						) }
					</div>
				</div>
			);

		default:
			return null;
	} //end switch
};
