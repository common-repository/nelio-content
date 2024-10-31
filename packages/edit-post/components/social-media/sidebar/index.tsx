/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { MainPanel } from './main-panel';
import { Timeline } from './timeline';
import { AutomationSettings } from './automation-settings';
import { PermalinkSettings } from './permalink-settings';
import { store as NC_EDIT_POST } from '../../../store';

export const SocialMediaSidebar = (): JSX.Element => {
	const isPostReady = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isPostReady()
	);
	const isRetrievingSocialMessages = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isRetrievingSocialMessages()
	);

	if ( ! isPostReady ) {
		return (
			<PanelBody>
				{ _x(
					'Please save post first to access this feature.',
					'user',
					'nelio-content'
				) }
			</PanelBody>
		);
	} //end if

	if ( isRetrievingSocialMessages ) {
		return (
			<PanelBody>{ _x( 'Loading…', 'text', 'nelio-content' ) }</PanelBody>
		);
	} //end if

	return (
		<>
			<MainPanel />
			<Timeline />
			<AutomationSettings />
			<PermalinkSettings />
		</>
	);
};
