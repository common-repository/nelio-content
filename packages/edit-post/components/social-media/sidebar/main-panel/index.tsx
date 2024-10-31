/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { PanelBody, PanelRow } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';

import { GenerateButton } from '../../common/generate-button';

export const MainPanel = (): JSX.Element => (
	<PanelBody className="nelio-content-social-media-sidebar-main-panel">
		<PanelRow className="nelio-content-social-media-sidebar-main-panel__buttons">
			<GenerateButton />
		</PanelRow>
	</PanelBody>
);
