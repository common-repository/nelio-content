/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { useAreGroupsDirty } from '~/nelio-content-pages/settings/automations/hooks';
import { PauseButton } from './pause-button';
import { ResetButton } from './reset-button';

export const Actions = (): JSX.Element | null => {
	const areGroupsDirty = useAreGroupsDirty();
	const isVisible = useSelect(
		( select ) => !! select( NC_DATA ).canCurrentUserManagePlugin()
	);

	if ( ! isVisible || areGroupsDirty ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-message-actions">
			<ResetButton />
			<span>|</span>
			<PauseButton />
		</div>
	);
};
