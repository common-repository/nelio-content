/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Popover, SlotFillProvider } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { StrictMode } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies.
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies.
 */
import './style.scss';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

import { FeedList } from '../feed-list';
import { NewFeedForm } from '../new-feed-form';
import { EditFeedForm } from '../edit-feed-form';

export const Layout = (): JSX.Element => {
	const hasFeeds = useSelect(
		( select ) => !! select( NC_DATA ).getFeeds().length
	);
	const { showSettings } = useDispatch( NC_FEEDS );

	return (
		<div className="nelio-content-feed-settings-layout">
			<StrictMode>
				<SlotFillProvider>
					<h1 className="wp-heading-inline">
						{ _x( 'Feeds', 'text', 'nelio-content' ) }
						{ hasFeeds && (
							<Button
								className="page-title-action"
								onClick={ () => showSettings( false ) }
							>
								{ _x(
									'Show Feeds',
									'command',
									'nelio-content'
								) }
							</Button>
						) }
					</h1>

					<NewFeedForm />
					<FeedList />
					<EditFeedForm />
					<Popover.Slot />
				</SlotFillProvider>
			</StrictMode>
		</div>
	);
};
