/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { PermalinkSettings as Content } from '../../common/permalink-settings';

export const PermalinkSettings = (): JSX.Element => (
	<PanelBody title={ _x( 'Permalink Settings', 'text', 'nelio-content' ) }>
		<Content />
	</PanelBody>
);
