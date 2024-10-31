/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Modal } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingModal } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { SocialMessageEditor } from '@nelio-content/social-message-editor';
import { SocialTimeline as ActualSocialTimeline } from '@nelio-content/social-timeline';
import type { Post } from '@nelio-content/types';

export const SocialTimeline = (): JSX.Element => (
	<>
		<SocialTimelineModal />
		<SocialMessageEditor />
	</>
);

// ============
// HELPER VIEWS
// ============

const SocialTimelineModal = () => {
	const { status, post } = usePostLoader();
	const { setPageAttribute } = useDispatch( NC_DATA );
	const postId = useSelect( ( select ) =>
		select( NC_DATA ).getPageAttribute( 'post-list/social-media-details' )
	);

	const onClose = () =>
		setPageAttribute( 'post-list/social-media-details', undefined );

	switch ( status ) {
		case 'no-post':
			return null;

		case 'loading':
		case 'not-found':
			return (
				<LoadingModal
					className="nelio-content-social-timeline-modal"
					title={ _x( 'Social Timeline', 'text', 'nelio-content' ) }
					onClose={ onClose }
					isLoading={ 'loading' === status }
					loadingErrorMessage={
						'not-found' === status
							? sprintf(
									/* translators: a post ID */
									_x(
										'Post %d not found.',
										'text',
										'nelio-content'
									),
									postId
							  )
							: ''
					}
				/>
			);

		case 'ready':
			return (
				<Modal
					className="nelio-content-social-timeline-modal"
					title={
						( <Title onClose={ onClose } /> ) as unknown as string
					}
					isDismissible={ false }
					shouldCloseOnEsc={ false }
					shouldCloseOnClickOutside={ false }
					onRequestClose={ () => void null }
				>
					<ActualSocialTimeline post={ post } />
				</Modal>
			);
	} //end switch
};

// =====
// HOOKS
// =====

const Title = ( { onClose }: { onClose: () => void } ) => (
	<div className="nelio-content-social-timeline-modal__custom-header">
		<span>{ _x( 'Social Timeline', 'text', 'nelio-content' ) }</span>
		<span>
			<button
				type="button"
				className="components-button has-icon"
				aria-label={ _x( 'Close', 'command', 'nelio-content' ) }
				onClick={ onClose }
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					aria-hidden="true"
					focusable="false"
				>
					<path d="M13 11.8l6.1-6.3-1-1-6.1 6.2-6.1-6.2-1 1 6.1 6.3-6.5 6.7 1 1 6.5-6.6 6.5 6.6 1-1z"></path>
				</svg>
			</button>
		</span>
	</div>
);

type PostLoaderResult =
	| {
			readonly status: 'no-post' | 'loading' | 'not-found';
			readonly post?: never;
	  }
	| {
			readonly status: 'ready';
			readonly post: Post;
	  };

const usePostLoader = () =>
	useSelect( ( select ): PostLoaderResult => {
		select( NC_DATA );

		const postId = select( NC_DATA ).getPageAttribute(
			'post-list/social-media-details'
		);
		if ( ! postId ) {
			return { status: 'no-post' };
		} //end if

		select( NC_DATA ).getPostRelatedItems( postId );
		const { isResolving } = select( NC_DATA );
		const isLoading =
			isResolving( 'getPost', [ postId ] ) ||
			isResolving( 'getPostRelatedItems', [ postId ] );

		if ( isLoading ) {
			return { status: 'loading' };
		} //end if

		const post = select( NC_DATA ).getPost( postId );
		return post ? { status: 'ready', post } : { status: 'not-found' };
	} );
