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
import { SocialMessageEditor } from '@nelio-content/social-message-editor';

/**
 * Internal dependencies
 */
import './style.scss';

import { PostFilter } from '../post-filter';
import { PostList } from '../post-list';
import { SortingCriterionSelector } from '../sorting-criterion-selector';

export const Layout = (): JSX.Element => (
	<StrictMode>
		<SlotFillProvider>
			<div className="nelio-content-analytics">
				<div className="nelio-content-analytics__title">
					<h1 className="nelio-content-analytics__actual-title wp-heading-inline">
						{ _x( 'Analytics', 'text', 'nelio-content' ) }
					</h1>

					<PostFilter />
				</div>
				<SortingCriterionSelector />

				<PostList />
			</div>

			<SocialMessageEditor />
			<PremiumDialog />
			<Popover.Slot />
		</SlotFillProvider>
	</StrictMode>
);
