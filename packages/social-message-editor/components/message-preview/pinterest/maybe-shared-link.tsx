/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { useSharedLinkAttributes } from '../../../hooks';

export const MaybeSharedLink = (): JSX.Element | null => {
	const { sharedLinkStatus, sharedLink: { title, domain } = {} } =
		useSharedLinkAttributes( 'last' );

	switch ( sharedLinkStatus ) {
		case 'ready':
			return (
				<div className="nelio-content-pinterest-shared-link">
					<div className="nelio-content-pinterest-shared-link__content">
						<div className="nelio-content-pinterest-shared-link__domain">
							{ domain }
						</div>

						<div className="nelio-content-pinterest-shared-link__title">
							{ title }
						</div>
					</div>
				</div>
			);

		default:
			return null;
	} //end switch
};
