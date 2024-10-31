/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useSharedLinkAttributes } from '../../../hooks';

import { SharedLinkLoader } from '../shared-link-loader';

export const MaybeSharedLink = (): JSX.Element | null => {
	const {
		sharedLinkStatus,
		sharedLink: { title, image, excerpt, domain } = {},
	} = useSharedLinkAttributes( 'last' );

	switch ( sharedLinkStatus ) {
		case 'loading':
			return <SharedLinkLoader />;

		case 'ready':
			return !! image ? (
				<>
					<div className="nelio-content-twitter-shared-link-with-image">
						<img
							className="nelio-content-twitter-shared-link-with-image__image"
							alt={ _x(
								'Featured image in shared link',
								'text',
								'nelio-content'
							) }
							src={ image }
						/>

						<div className="nelio-content-twitter-shared-link-with-image__title-container">
							<div className="nelio-content-twitter-shared-link-with-image__title">
								{ title }
							</div>
						</div>
					</div>
					<div className="nelio-content-twitter-shared-link-with-image__domain">
						{ sprintf(
							/* translators: domain */
							_x( 'From %s', 'text', 'nelio-content' ),
							domain
						) }
					</div>
				</>
			) : (
				<>
					<div className="nelio-content-twitter-shared-link">
						<div className="nelio-content-twitter-shared-link__logo">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<g>
									<path d="M1.998 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.12 2.5 2.5v13c0 1.38-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.276 0-.5.22-.5.5v13c0 .28.224.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zM6 7h6v6H6V7zm2 2v2h2V9H8zm10 0h-4V7h4v2zm0 4h-4v-2h4v2zm-.002 4h-12v-2h12v2z"></path>
								</g>
							</svg>
						</div>
						<div className="nelio-content-twitter-shared-link__content">
							<div className="nelio-content-twitter-shared-link__domain">
								{ domain }
							</div>
							<div className="nelio-content-twitter-shared-link__title">
								{ title }
							</div>
							<div className="nelio-content-twitter-shared-link__excerpt">
								{ excerpt }
							</div>
						</div>
					</div>
				</>
			);

		default:
			return null;
	} //end switch
};
