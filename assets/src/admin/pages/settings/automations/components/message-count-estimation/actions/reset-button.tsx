/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

export const ResetButton = (): JSX.Element => {
	const status = useSelect( ( select ) =>
		select( NC_DATA ).getResetStatus()
	);

	switch ( status ) {
		case 'ready':
			return <Ready />;

		case 'resetting':
			return <Resetting />;

		case 'done':
			return <Done />;

		case 'error':
			return <Error />;
	} //end switch
};

// =======
// HELPERS
// =======

const Ready = () => {
	const { resetSocialMessages } = useDispatch( NC_DATA );
	return (
		<Button variant="link" onClick={ resetSocialMessages }>
			{ _x( 'Reset Social Messages', 'command', 'nelio-content' ) }
		</Button>
	);
};

const Resetting = () => (
	<>{ _x( 'Resetting Social Messages…', 'text', 'nelio-content' ) }</>
);

const Done = () => (
	<>
		<Dashicon icon="info" />{ ' ' }
		{ _x(
			'Social messages will be automatically regenerated shortly',
			'text',
			'nelio-content'
		) }
	</>
);

const Error = () => (
	<>
		<Dashicon icon="warning" />{ ' ' }
		{ _x( 'Unable to reset social messages', 'text', 'nelio-content' ) }
	</>
);
