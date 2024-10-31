/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { SocialTimeline } from '@nelio-content/social-timeline';

/**
 * Internal dependencies
 */
import './style.scss';
import { useDeletingMessageIds, useIsTimelineBusy, usePost } from '../../hooks';
import { ClearTimelineButton } from '../../common/clear-timeline-button';
import { store as NC_EDIT_POST } from '../../../../store';

export const Timeline = (): JSX.Element | null => {
	const { deleteSocialMessage } = useDispatch( NC_EDIT_POST );
	const deletingMessageIds = useDeletingMessageIds();
	const isTimelineBusy = useIsTimelineBusy();
	const post = usePost();

	const hasUnpublishedMessages = useHasUnpublishedMessages();
	if ( ! hasUnpublishedMessages ) {
		return null;
	} //end if

	return (
		<PanelBody
			className="nelio-content-sidebar-timeline"
			title={ _x( 'Social Timeline', 'text', 'nelio-content' ) }
		>
			<SocialTimeline
				deleteMessage={ deleteSocialMessage }
				deletingMessageIds={ deletingMessageIds }
				isTimelineBusy={ isTimelineBusy }
				post={ post }
			/>
			<div className="nelio-content-sidebar-timeline__clear-button">
				<ClearTimelineButton />
			</div>
		</PanelBody>
	);
};

// =====
// HOOKS
// =====

const useHasUnpublishedMessages = () =>
	useSelect( ( select ) => {
		const { getPostId } = select( NC_EDIT_POST );
		const { getSocialMessagesRelatedToPost } = select( NC_DATA );
		const messages = getSocialMessagesRelatedToPost( getPostId() );
		return !! find( messages, ( { status } ) => 'publish' !== status );
	} );
