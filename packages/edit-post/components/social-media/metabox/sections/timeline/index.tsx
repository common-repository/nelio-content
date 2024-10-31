/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
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
import { TitleActions } from './title-actions';
import {
	useDeletingMessageIds,
	useIsTimelineBusy,
	usePost,
} from '../../../hooks';
import { Section } from '../../section';
import { GenerateButton } from '../../../common/generate-button';
import { store as NC_EDIT_POST } from '../../../../../store';

export const TimelineSection = (): JSX.Element => {
	const hasProfiles = useSelect(
		( select ) => !! select( NC_DATA ).getSocialProfileCount()
	);
	const hasUnpublishedMessages = useHasUnpublishedMessages();

	const { deleteSocialMessage } = useDispatch( NC_EDIT_POST );
	const deletingMessageIds = useDeletingMessageIds();
	const isTimelineBusy = useIsTimelineBusy();
	const post = usePost();

	return (
		<Section
			icon="share"
			title={ _x( 'Timeline', 'text', 'nelio-content' ) }
			titleActions={
				<TitleActions
					enabled={ hasProfiles && hasUnpublishedMessages }
				/>
			}
			type="timeline"
		>
			{ hasUnpublishedMessages ? (
				<SocialTimeline
					deleteMessage={ deleteSocialMessage }
					deletingMessageIds={ deletingMessageIds }
					isTimelineBusy={ isTimelineBusy }
					post={ post }
				/>
			) : (
				<GenerateButton />
			) }
		</Section>
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
