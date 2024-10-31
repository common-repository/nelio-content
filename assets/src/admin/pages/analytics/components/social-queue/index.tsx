/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, Spinner, Tooltip } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map, filter } from 'lodash';
import { store as NC_DATA, useFeatureGuard } from '@nelio-content/data';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import type { PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type SocialQueueProps = {
	readonly className: string;
	readonly postId: PostId;
};

export const SocialQueue = ( {
	className,
	postId,
}: SocialQueueProps ): JSX.Element => {
	const isLoading = useIsLoading( postId );
	const canCreateMessages = useCanCreateMessages( postId );
	const { published, total } = useMessageCount( postId );
	const createMessage = useMessageCreator( postId );

	if ( isLoading ) {
		return (
			<div
				className={ `nelio-content-analytics-social-queue nelio-content-analytics-social-queue--is-loading ${ className }` }
			>
				<Spinner />
			</div>
		);
	} //end if

	return (
		<div
			className={ `nelio-content-analytics-social-queue ${ className }` }
		>
			<div className="nelio-content-analytics-social-queue__title">
				{ _x( 'Social Queue', 'text', 'nelio-content' ) }
				<Tooltip
					text={ _x(
						'Total number of scheduled social messages.',
						'text',
						'nelio-content'
					) }
					placement="bottom"
				>
					<span className="nelio-content-analytics-social-queue__help-icon">
						<Dashicon icon="editor-help" />
					</span>
				</Tooltip>
			</div>

			<div className="nelio-content-analytics-social-queue__message-count">
				{ total - published }
			</div>

			<div className="nelio-content-analytics-social-queue__published-message-count">
				{ published !== total
					? sprintf(
							/* translators: 1 -> number of social messages sent, 2 -> total number of social messages */
							_x( 'Sent: %1$d/%2$d', 'text', 'nelio-content' ),
							published,
							total
					  )
					: sprintf(
							/* translators: 1 -> number of social messages sent */
							_x( 'Sent: %d', 'text', 'nelio-content' ),
							published
					  ) }
			</div>

			<div className="nelio-content-analytics-social-queue__actions">
				<Button
					variant="secondary"
					size="small"
					disabled={ ! canCreateMessages }
					onClick={ createMessage }
				>
					{ _x( 'Add Message', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = ( postId: PostId ) =>
	useSelect( ( select ) =>
		select( NC_DATA ).isResolving( 'getPostRelatedItems', [ postId ] )
	);

const useCanCreateMessages = ( postId: PostId ) =>
	useSelect( ( select ) => {
		const { canCurrentUserCreateMessagesRelatedToPost, getPost } =
			select( NC_DATA );
		const post = getPost( postId );
		return canCurrentUserCreateMessagesRelatedToPost( post );
	} );

const useMessageCount = ( postId: PostId ) =>
	useSelect( ( select ) => {
		const { getSocialMessage, getSocialMessageIdsRelatedToPost } =
			select( NC_DATA );

		const messages = map(
			getSocialMessageIdsRelatedToPost( postId ),
			getSocialMessage
		);
		const publishedMessages = filter( messages, { status: 'publish' } );

		return {
			published: publishedMessages.length,
			total: messages.length,
		};
	} );

const useMessageCreator = ( postId: PostId ) => {
	const canCreate = useCanCreateMessages( postId );
	const post = useSelect( ( select ) => select( NC_DATA ).getPost( postId ) );

	const guard = useFeatureGuard( 'analytics/create-messages', canCreate );
	const { openNewSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );
	return guard( () =>
		openNewSocialMessageEditor( {}, { context: 'analytics', post } )
	);
};
