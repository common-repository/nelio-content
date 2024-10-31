/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, ExternalLink } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA, useFeatureGuard } from '@nelio-content/data';
import { dateI18n, getSettings as getDateSettings } from '@nelio-content/date';
import { store as NC_POST_EDITOR } from '@nelio-content/post-quick-editor';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import type { Maybe, FeedItem, FeedItemId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export type ItemProps = {
	readonly itemId: FeedItemId;
};

export const Item = ( { itemId }: ItemProps ): JSX.Element | null => {
	const feedItem = useSelect( ( select ) =>
		select( NC_FEEDS ).getItem( itemId )
	);
	const feed = useSelect( ( select ) => {
		const { getFeed } = select( NC_DATA );
		return feedItem ? getFeed( feedItem.feedId ) : undefined;
	} );

	const createMessage = useMessageCreator( feedItem, feed?.twitter );
	const createPost = usePostCreator( feedItem );
	const canCreatePosts = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserCreatePosts()
	);

	if ( ! feed || ! feedItem ) {
		return null;
	} //end if

	const { title, permalink, authors, date, excerpt } = feedItem;
	const { icon: feedIcon, name: feedName } = feed;

	const author = authors.join( ', ' );

	return (
		<div className="nelio-content-feed-list-item">
			<div className="nelio-content-feed-list-item__title">{ title }</div>

			{ !! permalink && (
				<div className="nelio-content-feed-list-item__permalink">
					<ExternalLink href={ permalink }>
						{ permalink }
					</ExternalLink>
				</div>
			) }

			<div className="nelio-content-feed-list-item__icon">
				<div
					className="nelio-content-feed-list-item__actual-icon"
					title={ feedName }
					style={ {
						backgroundColor: feedIcon && 'transparent',
						backgroundImage: feedIcon && `url(${ feedIcon })`,
					} }
				></div>
			</div>

			<div className="nelio-content-feed-list-item__meta">
				{ author
					? sprintf(
							/* translators: 1 -> author name, 2 -> date */
							_x(
								'Published by %1$s on %2$s',
								'text',
								'nelio-content'
							),
							author,
							dateI18n( getDateSettings().formats.date, date )
					  )
					: sprintf(
							/* translators: date */
							_x( 'Published on %s', 'text', 'nelio-content' ),
							dateI18n( getDateSettings().formats.date, date )
					  ) }
			</div>

			<div className="nelio-content-feed-list-item__excerpt">
				{ excerpt }
			</div>

			<div className="nelio-content-feed-list-item__actions">
				<Button
					variant="secondary"
					size="small"
					onClick={ createMessage }
				>
					<span className="nelio-content-feed-list-item__action-label">
						<Dashicon icon="share" />
						{ _x( 'Share', 'command', 'nelio-content' ) }
					</span>
				</Button>

				{ canCreatePosts && (
					<Button
						variant="secondary"
						size="small"
						onClick={ createPost }
					>
						<span className="nelio-content-feed-list-item__action-label">
							<Dashicon icon="edit" />{ ' ' }
							{ _x(
								'Write about it',
								'command',
								'nelio-content'
							) }
						</span>
					</Button>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useMessageCreator = ( feedItem: Maybe< FeedItem >, twitter?: string ) => {
	const canCreate = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserCreateMessagesAlways()
	);
	const guard = useFeatureGuard( 'feeds/share-post', canCreate );
	const { openNewSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );
	return guard( () => {
		if ( ! feedItem ) {
			return;
		} //end if
		const { title, permalink } = feedItem;
		const text = ! twitter
			? `${ title } ${ permalink }`
			: `${ title } /cc ${ twitter } ${ permalink }`;

		void openNewSocialMessageEditor(
			{ text, textComputed: text },
			{ context: 'feeds' }
		);
	} );
};

const usePostCreator = ( feedItem: Maybe< FeedItem > ) => {
	const { openNewPostEditor, setExtraInfoTab, setReferences } =
		useDispatch( NC_POST_EDITOR );
	return () => {
		if ( ! feedItem ) {
			return;
		} //end if
		const { title, permalink } = feedItem;
		void openNewPostEditor( 'calendar', { title } );
		void setExtraInfoTab( 'references' );
		void setReferences( [ { url: permalink, title: '' } ] );
	};
};
