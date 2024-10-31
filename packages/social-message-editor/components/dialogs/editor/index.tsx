/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ContextualHelp, LoadingModal } from '@nelio-content/components';
import { useIsSubscribed } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { walkthrough } from '../../../walkthrough';

import {
	useIsLoadingRelatedPost,
	useIsNewMessage,
	useIsSaving,
	useRelatedPostStatus,
} from '../../../hooks';

import { Actions } from '../../actions';
import { DateSelector } from '../../date-selector';
import { ErrorDetector } from '../../error-detector';
import { MessageEditor } from '../../message-editor';
import { MessagePreview } from '../../message-preview';
import { ProfileSelector } from '../../profile-selector';
import { QuickActions } from '../../quick-actions';
import { RecurrenceSummary } from '../../recurrence-summary';
import { RecurrenceUpdater } from '../../recurrence-updater';
import { TimeSelector } from '../../time-selector';

export const EditorDialog = (): JSX.Element => {
	const isLoadingRelatedPost = useIsLoadingRelatedPost();
	const isSaving = useIsSaving();
	const isSubscribed = useIsSubscribed();
	const relatedPostStatus = useRelatedPostStatus();

	const title = <Title />;

	return (
		<LoadingModal
			className="nelio-content-social-message-editor"
			title={ title as unknown as string }
			onClose={ () => void null }
			isLoading={ isLoadingRelatedPost }
			loadingErrorMessage={
				'error' === relatedPostStatus.type
					? sprintf(
							/* translators: a post ID */
							_x( 'Post %d not found.', 'text', 'nelio-content' ),
							relatedPostStatus.postId
					  )
					: ''
			}
		>
			<ErrorDetector />
			<RecurrenceUpdater />

			<ProfileSelector disabled={ isSaving } />

			<MessageEditor disabled={ isSaving } />
			<QuickActions disabled={ isSaving } />

			<MessagePreview />

			<div className="nelio-content-social-message-editor__schedule-options">
				<DateSelector disabled={ isSaving || ! isSubscribed } />
				<TimeSelector disabled={ isSaving || ! isSubscribed } />
			</div>

			<RecurrenceSummary />

			<Actions />
		</LoadingModal>
	);
};

const Title = (): JSX.Element => {
	const isNewMessage = useIsNewMessage();
	return (
		<div className="nelio-content-social-message-editor__title">
			<div className="nelio-content-social-message-editor__title-text">
				{ isNewMessage
					? _x( 'Create Social Message', 'text', 'nelio-content' )
					: _x( 'Edit Social Message', 'text', 'nelio-content' ) }
			</div>
			<div className="nelio-content-social-message-editor__title-help">
				<ContextualHelp
					context="social-message-editor"
					walkthrough={ walkthrough }
					autostart={ true }
				/>
			</div>
		</div>
	);
};
