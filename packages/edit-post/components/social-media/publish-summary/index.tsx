/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

// WARNING! Don’t add a dependency with “@wordpress/edit-post”, as it
// should only be enqueued when the user is in the classic editor.
const EDIT_POST = 'core/edit-post';

export const SocialMediaSummary = (): JSX.Element => {
	const label = useLabel();

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { openGeneralSidebar } = useDispatch( EDIT_POST );
	const sidebar = 'nelio-content/nelio-content-social-sidebar';

	return (
		<div className="nelio-content-social-media-publish-summary">
			<div className="nelio-content-social-media-publish-summary__icon">
				<Dashicon icon="share" />
			</div>
			<div className="nelio-content-social-media-publish-summary__button">
				<Button
					variant="link"
					onClick={ () =>
						// eslint-disable-next-line @typescript-eslint/no-unsafe-call
						void openGeneralSidebar( sidebar )
					}
				>
					{ label }
				</Button>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useLabel = () =>
	useSelect( ( select ) => {
		const { getPost } = select( NC_EDIT_POST );
		const { getSocialMessagesRelatedToPost } = select( NC_DATA );

		const { status, id } = getPost() || {};
		const messages = getSocialMessagesRelatedToPost( id );
		if ( 'publish' === status && isEmpty( messages ) ) {
			return _x( 'Share on social media', 'command', 'nelio-content' );
		} //end if

		if ( isEmpty( messages ) ) {
			const { isAutoShareEnabled } = select( NC_EDIT_POST );
			return isAutoShareEnabled()
				? _x( 'Customize social messages', 'command', 'nelio-content' )
				: _x( 'Share on social media', 'command', 'nelio-content' );
		} //end if

		const unpublishedMessages = messages.filter(
			( { status: postStatus } ) => 'publish' !== postStatus
		);
		const numOfUnpublishedMessages = unpublishedMessages.length;

		return sprintf(
			/* translators: number of social messages */
			_nx(
				'%d social message ready',
				'%d social messages ready',
				numOfUnpublishedMessages,
				'text',
				'nelio-content'
			),
			numOfUnpublishedMessages
		);
	} );
