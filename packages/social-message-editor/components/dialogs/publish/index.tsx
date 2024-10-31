/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingModal } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_SOCIAL_EDITOR } from '../../../store';
import {
	useIsLoadingRelatedPost,
	useRelatedPost,
	useRelatedPostId,
	useText,
} from '../../../hooks';

export const PublishDialog = (): JSX.Element => {
	const [ post ] = useRelatedPost();
	const postId = useRelatedPostId();
	const hasPost = !! postId;

	const isLoadingRelatedPost = useIsLoadingRelatedPost();
	const [ text ] = useText();

	const { close } = useDispatch( NC_SOCIAL_EDITOR );

	return (
		<LoadingModal
			className="nelio-content-social-message-publish-dialog"
			title={ _x( 'Social Message', 'text', 'nelio-content' ) }
			onClose={ close }
			isLoading={ isLoadingRelatedPost }
		>
			<div className="nelio-content-social-message-publish-dialog__content">
				<p>{ text }</p>
				{ hasPost && !! post?.title && (
					<p>
						<strong>
							{ _x( 'Related Post:', 'text', 'nelio-content' ) }
						</strong>{ ' ' }
						<ExternalLink href={ post?.viewLink }>
							{ post?.title }
						</ExternalLink>
					</p>
				) }
				{ hasPost && ! post?.title && (
					<p>
						<em>
							<strong>
								{ _x( 'Warning:', 'text', 'nelio-content' ) +
									' ' }
							</strong>
							{ sprintf(
								/* translators: post id */
								_x(
									'related post “%d” couldn’t be loaded.',
									'text',
									'nelio-content'
								),
								postId
							) }
						</em>
					</p>
				) }
			</div>
			<div className="nelio-content-social-message-publish-dialog__actions">
				<Button variant="secondary" onClick={ close }>
					{ _x( 'Close', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</LoadingModal>
	);
};
