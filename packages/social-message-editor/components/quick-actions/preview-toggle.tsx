/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	doesNetworkRequire,
	doesNetworkSupport,
} from '@nelio-content/networks';

/**
 * Internal dependencies
 */
import { useActiveSocialNetwork, usePreview } from '../../hooks';

export type PreviewToggleProps = {
	readonly disabled?: boolean;
};

export const PreviewToggle = ( {
	disabled,
}: PreviewToggleProps ): JSX.Element | null => {
	const activeNetwork = useActiveSocialNetwork();
	const supportsPreviewToggling =
		doesNetworkSupport( 'preview', activeNetwork ) &&
		! doesNetworkRequire( 'preview', activeNetwork );
	const [ isVisible, setVisible ] = usePreview();

	if ( ! supportsPreviewToggling ) {
		return null;
	} //end if

	return (
		<Button
			className={ classnames( {
				'nelio-content-social-message-editor__quick-action': true,
				'nelio-content-social-message-editor__quick-action--is-preview':
					true,
				'nelio-content-social-message-editor__quick-action--is-toggled':
					isVisible,
			} ) }
			icon="visibility"
			label={ _x( 'Preview', 'text', 'nelio-content' ) }
			tooltipPosition="bottom center"
			isPressed={ isVisible }
			disabled={ disabled }
			onClick={ () => setVisible( ! isVisible ) }
		/>
	);
};
