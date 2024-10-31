/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { SubscribeAction } from '@nelio-content/components';
import {
	store as NC_DATA,
	useFeatureGuard,
	withProfileCheck,
} from '@nelio-content/data';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';

import {
	useCanUseAutomations,
	useCanCreateMessages,
	useHasUsableAutomationGroups,
	useCouldSubscriberCreateMessages,
} from '../../hooks';
import { getDisabledProfiles } from '../../../../utils';
import { store as NC_EDIT_POST } from '../../../../store';

const InternalGenerateButton = (): JSX.Element => {
	const isBusy = useIsBusy();
	const label = useLabel();
	const hasAutomations = useHasUsableAutomationGroups();
	const canUseAutomations = useCanUseAutomations();

	const { savePostAndGenerateTimeline } = useDispatch( NC_EDIT_POST );

	const post = useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );

	const { openNewSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );
	const canActuallyCreateMessages = useCanCreateMessages();
	const couldSubscriberCreateMessages = useCouldSubscriberCreateMessages();
	const guard = useFeatureGuard(
		'edit-post/create-more-messages',
		couldSubscriberCreateMessages && ! canActuallyCreateMessages
	);
	const addSocialMessage = guard( () =>
		openNewSocialMessageEditor(
			{},
			{ context: 'post', post, disabledProfileIds: getDisabledProfiles() }
		)
	);

	return (
		<div className="nelio-content-generate-timeline-button">
			<SubscribeAction className="nelio-content-generate-timeline-button__promo-button" />
			{ hasAutomations && (
				<div className="nelio-content-generate-timeline-button__timeline-button">
					<Button
						variant="primary"
						isBusy={ isBusy }
						disabled={ ! canUseAutomations }
						onClick={ savePostAndGenerateTimeline }
					>
						{ label }
					</Button>
				</div>
			) }
			<div className="nelio-content-generate-timeline-button__single-button">
				<Button
					variant={ hasAutomations ? 'tertiary' : 'primary' }
					disabled={ ! couldSubscriberCreateMessages }
					onClick={ addSocialMessage }
					icon={
						! canActuallyCreateMessages &&
						couldSubscriberCreateMessages
							? 'lock'
							: undefined
					}
				>
					{ _x( 'Add Social Message', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</div>
	);
};

export const GenerateButton = withProfileCheck( InternalGenerateButton );

// =====
// HOOKS
// =====

const useIsBusy = () =>
	useSelect( ( select ) => select( NC_EDIT_POST ).isGeneratingTimeline() );

const useLabel = () =>
	useSelect( ( select ) => {
		select( NC_DATA );
		const post = select( NC_EDIT_POST ).getPost();
		if ( ! post ) {
			return '';
		} //end if

		const status = post.status;
		const id = post.id;

		const messages = select( NC_DATA ).getSocialMessagesRelatedToPost( id );
		const unpublishedMessages = messages.filter(
			( { status: postStatus } ) => 'publish' !== postStatus
		);

		const { isGeneratingTimeline } = select( NC_EDIT_POST );
		if ( ! isEmpty( unpublishedMessages ) ) {
			return isGeneratingTimeline()
				? _x( 'Generating Timeline…', 'text', 'nelio-content' )
				: _x( 'Regenerate Timeline', 'command', 'nelio-content' );
		} //end if

		if ( 'publish' === status ) {
			return isGeneratingTimeline()
				? _x( 'Filling Timeline…', 'text', 'nelio-content' )
				: _x( 'Fill Timeline', 'command', 'nelio-content' );
		} //end if

		const { isAutoShareEnabled } = select( NC_EDIT_POST );
		if ( isAutoShareEnabled() ) {
			return isGeneratingTimeline()
				? _x( 'Loading Timeline…', 'text', 'nelio-content' )
				: _x( 'Customize Timeline', 'command', 'nelio-content' );
		} //end if

		return isGeneratingTimeline()
			? _x( 'Generating Timeline…', 'text', 'nelio-content' )
			: _x( 'Generate Timeline', 'command', 'nelio-content' );
	} );
