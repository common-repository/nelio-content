/**
 * NOTE. This file is based on the “regular” editor. Some features
 * have been removed, because they don’t make sense on reusable
 * messages.
 *
 * Class names are those of the regular editor (which means no
 * style is necessary). The tutorial walkthrough has been removed
 * as well.
 */

/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingModal } from '@nelio-content/components';
import { useIsSubscribed } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import {
	useIsLoadingRelatedPost,
	useIsSaving,
	useRelatedPostStatus,
} from '../../../hooks';
import { store as NC_SOCIAL_EDITOR } from '../../../store';

import { ErrorDetector } from '../../error-detector';
import { MessageEditor } from '../../message-editor';
import { MessagePreview } from '../../message-preview';
import { SingleProfileSelector } from '../../profile-selector/single';

import { Actions } from './actions';
import { QuickActions } from './quick-actions';
import { TimeSelector } from './time-selector';

export const ReusableEditorDialog = (): JSX.Element => {
	const isLoadingRelatedPost = useIsLoadingRelatedPost();
	const isSaving = useIsSaving();
	const isSubscribed = useIsSubscribed();
	const relatedPostStatus = useRelatedPostStatus();

	const { close } = useDispatch( NC_SOCIAL_EDITOR );
	const title = <Title />;

	return (
		<LoadingModal
			className="nelio-content-social-message-editor"
			title={ title as unknown as string }
			onClose={ close }
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

			<SingleProfileSelector disabled={ isSaving } />

			<MessageEditor disabled={ isSaving } />
			<QuickActions disabled={ isSaving } />

			<MessagePreview />

			<div className="nelio-content-social-message-editor__schedule-options">
				<TimeSelector disabled={ isSaving || ! isSubscribed } />
			</div>

			<Actions />
		</LoadingModal>
	);
};

const Title = (): JSX.Element => {
	const isNew = useSelect(
		( select ) => ! select( NC_SOCIAL_EDITOR ).getReusableMessageId()
	);
	return (
		<div className="nelio-content-social-message-editor__title">
			<div className="nelio-content-social-message-editor__title-text">
				{ isNew
					? _x(
							'Create Reusable Social Message',
							'text',
							'nelio-content'
					  )
					: _x(
							'Edit Reusable Social Message',
							'text',
							'nelio-content'
					  ) }
			</div>
		</div>
	);
};
