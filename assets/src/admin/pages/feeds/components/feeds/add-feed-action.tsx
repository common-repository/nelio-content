/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { useCanManagePlugin } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export const AddFeedAction = (): JSX.Element | null => {
	const canManagePlugin = useCanManagePlugin();
	const { showSettings } = useDispatch( NC_FEEDS );

	if ( ! canManagePlugin ) {
		return null;
	} //end if

	return (
		<Button
			className="page-title-action"
			onClick={ () => showSettings( true ) }
		>
			{ _x( 'Manage Feeds', 'command', 'nelio-content' ) }
		</Button>
	);
};
