/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section } from '../section';
import { AutomationSettings as Content } from '../../common/automation-settings';

export const SettingsSection = (): JSX.Element => (
	<Section
		icon="admin-settings"
		title={ _x( 'Automation Settings', 'text', 'nelio-content' ) }
		type="settings"
	>
		<Content />
	</Section>
);
