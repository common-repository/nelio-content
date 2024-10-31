/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { compose } from '@safe-wordpress/compose';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';

import { AnalyticsSection } from './sections/analytics';
import { PermalinkSettingsSection } from './sections/permalink-settings';
import { SettingsSection } from './sections/settings';
import { TimelineSection } from './sections/timeline';

import { withLoadingCheck, withPostReadyCheck } from '../../safe-guards';

const InternalSocialMediaMetabox = (): JSX.Element => {
	return (
		<SlotFillProvider>
			<div className="nelio-content-social-media-metabox">
				<AnalyticsSection />
				<TimelineSection />
				<SettingsSection />
				<PermalinkSettingsSection />
			</div>
			<Popover.Slot />
		</SlotFillProvider>
	);
};

export const SocialMediaMetabox = compose(
	withPostReadyCheck,
	withLoadingCheck( 'isRetrievingSocialMessages' )
)( InternalSocialMediaMetabox ) as typeof InternalSocialMediaMetabox;
