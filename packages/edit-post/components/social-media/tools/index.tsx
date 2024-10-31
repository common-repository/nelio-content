/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { compose } from '@safe-wordpress/compose';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { withProfileCheck } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

import { withPostReadyCheck } from '../../safe-guards';

// WARNING! Don’t add a dependency with “@wordpress/edit-post”, as it
// should only be enqueued when the user is in the classic editor.
const EDIT_POST = 'core/edit-post';

const InternalSocialMediaTools = (): JSX.Element => {
	const sidebar = 'nelio-content/nelio-content-social-sidebar';
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { openGeneralSidebar } = useDispatch( EDIT_POST );
	return (
		<div className="nelio-content-social-media-tools">
			<p>
				{ _x(
					'Nelio Content helps you share WordPress content on social media, so that you can reach a broader audience and engage with more people.',
					'text',
					'nelio-content'
				) }
			</p>

			<Button
				variant="secondary"
				onClick={ () =>
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					void openGeneralSidebar( sidebar )
				}
			>
				{ _x( 'View Social Timeline', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};

export const SocialMediaTools = compose(
	withProfileCheck,
	withPostReadyCheck
)( InternalSocialMediaTools ) as typeof InternalSocialMediaTools;
