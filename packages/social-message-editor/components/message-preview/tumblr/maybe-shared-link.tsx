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
	const {
		sharedLinkStatus,
		sharedLink: { domain, excerpt, image, title } = {},
	} = useSharedLinkAttributes( 'first' );

	switch ( sharedLinkStatus ) {
		case 'loading':
			return <SharedLinkLoader />;

		case 'ready':
			return (
				<div className="nelio-content-tumblr-shared-link">
					{ !! image && (
						<div className="nelio-content-tumblr-shared-link__image">
							<img
								alt={ _x(
									'Featured image in shared link',
									'text',
									'nelio-content'
								) }
								src={ image }
							/>
							<div className="nelio-content-tumblr-shared-link__signature">
								{ domain }
							</div>
						</div>
					) }

					<div className="nelio-content-tumblr-shared-link__content">
						<div className="nelio-content-tumblr-shared-link__title">
							{ title }
						</div>

						{ !! excerpt && (
							<div className="nelio-content-tumblr-shared-link__excerpt">
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
