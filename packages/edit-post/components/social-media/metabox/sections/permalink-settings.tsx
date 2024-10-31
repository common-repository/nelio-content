/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { Section } from '../section';
import { PermalinkSettings as Content } from '../../common/permalink-settings';

export const PermalinkSettingsSection = (): JSX.Element => (
	<Section
		icon="admin-links"
		title={ _x( 'Permalink Settings', 'text', 'nelio-content' ) }
		type="permalink-settings"
	>
		<Content />
	</Section>
);
