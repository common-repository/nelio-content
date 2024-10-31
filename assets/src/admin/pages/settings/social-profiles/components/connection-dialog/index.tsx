/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';
import { KindSelectorDialog } from './kind-selector-dialog';

export const ConnectionDialog = (): JSX.Element => {
	const isConnectionDialogOpen = useSelect(
		( select ) => !! select( NC_PROFILE_SETTINGS ).getConnectionDialog()
	);
	const isRefreshing = useSelect( ( select ) =>
		select( NC_PROFILE_SETTINGS ).isProfileListRefreshing()
	);
	const kindDialog = useSelect( ( select ) =>
		select( NC_PROFILE_SETTINGS ).getKindDialog()
	);
	const isKindDialogOpen = !! kindDialog;

	useEffect( () => {
		if ( isRefreshing || isConnectionDialogOpen ) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		} //end if
	}, [ isRefreshing, isConnectionDialogOpen ] );

	return (
		<div className="nelio-content-connection-dialog">
			{ isConnectionDialogOpen && (
				<div className="nelio-content-connection-dialog__overlay">
					<div className="nelio-content-connection-dialog__overlay-content">
						{ _x(
							'Please follow the instructions to authenticate the social profile…',
							'user',
							'nelio-content'
						) }
					</div>
				</div>
			) }

			{ isKindDialogOpen && (
				<KindSelectorDialog network={ kindDialog } />
			) }

			{ isRefreshing && (
				<div className="nelio-content-connection-dialog__overlay">
					<div className="nelio-content-connection-dialog__overlay-content">
						{ _x(
							'Refreshing social profiles…',
							'text',
							'nelio-content'
						) }
					</div>
				</div>
			) }
		</div>
	);
};
