/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';
import { StrictMode } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { PremiumDialog } from '@nelio-content/components';
import { PostQuickEditor } from '@nelio-content/post-quick-editor';
import { SocialMessageEditor } from '@nelio-content/social-message-editor';

/**
 * Internal dependencies
 */
import './style.scss';

import { AddFeedAction } from '../add-feed-action';
import { FeedFilter } from '../feed-filter';
import { FeedItemList } from '../feed-item-list';

export const Layout = (): JSX.Element => (
	<div className="nelio-content-feeds">
		<StrictMode>
			<SlotFillProvider>
				<div className="nelio-content-feeds__title">
					<h1 className="nelio-content-feeds__actual-title wp-heading-inline">
						{ _x( 'Feeds', 'text', 'nelio-content' ) }
						<AddFeedAction />
					</h1>

					<FeedFilter />
				</div>

				<FeedItemList />

				<PostQuickEditor context={ [ 'calendar', 'content-board' ] } />
				<SocialMessageEditor />

				<PremiumDialog />

				<Popover.Slot />
			</SlotFillProvider>
		</StrictMode>
	</div>
);
