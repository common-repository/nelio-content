/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { AutomationSettings as Content } from '../../common/automation-settings';

export const AutomationSettings = (): JSX.Element => (
	<PanelBody title={ _x( 'Automation Settings', 'text', 'nelio-content' ) }>
		<Content />
	</PanelBody>
);
