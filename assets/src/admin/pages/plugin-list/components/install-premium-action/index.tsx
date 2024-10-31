/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

export const InstallPremiumAction = (): JSX.Element => {
	const isInstalled = useSelect(
		( select ) => 'uninstalled' !== select( NC_DATA ).getPremiumStatus()
	);
	const { installPremium } = useDispatch( NC_DATA );
	const [ updating, setUpdating ] = useState< boolean >( false );
	const onUpdate = () => {
		setUpdating( true );
		void installPremium( () => {
			return window.location.reload();
		} );
	};

	const regularLabel = isInstalled
		? _x( 'Activate Nelio Content Premium', 'command', 'nelio-content' )
		: _x( 'Install Nelio Content Premium', 'command', 'nelio-content' );
	const processingLabel = isInstalled
		? _x( 'Activating Nelio Content Premium…', 'text', 'nelio-content' )
		: _x( 'Installing Nelio Content Premium…', 'text', 'nelio-content' );

	return (
		<Button
			variant="secondary"
			className="nelio-content-install-premium-plugin"
			onClick={ onUpdate }
			disabled={ updating }
			isBusy={ updating }
		>
			{ updating ? processingLabel : regularLabel }
		</Button>
	);
};
