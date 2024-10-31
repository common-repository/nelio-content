/**
 * External dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

export const PauseButton = (): JSX.Element => {
	const isPaused = useSelect( ( select ) =>
		select( NC_DATA ).isSocialPublicationPaused()
	);
	const isBusy = useSelect( ( select ) =>
		select( NC_DATA ).isSocialPublicationStatusBeingSynched()
	);

	const { toggleSocialPublicationStatus: toggle } = useDispatch( NC_DATA );

	const action = isPaused
		? _x( 'Resume Social Publication', 'command', 'nelio-content' )
		: _x( 'Pause Social Publication', 'command', 'nelio-content' );

	const working = isPaused
		? _x( 'Resuming Social Publication…', 'command', 'nelio-content' )
		: _x( 'Pausing Social Publication…', 'command', 'nelio-content' );

	return (
		<Button variant="link" disabled={ isBusy } onClick={ toggle }>
			{ isBusy ? working : action }
		</Button>
	);
};
