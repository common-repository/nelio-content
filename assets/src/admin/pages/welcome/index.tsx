/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import {
	Button,
	CheckboxControl,
	Dashicon,
	ExternalLink,
} from '@safe-wordpress/components';
import domReady from '@safe-wordpress/dom-ready';
import {
	createInterpolateElement,
	useEffect,
	useState,
	render,
} from '@safe-wordpress/element';
import { __, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Dict, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import Logo from '~/nelio-content-images/full-logo.svg';

domReady( () => {
	const content = document.getElementById( 'nelio-content-page' );
	render( <Page />, content );
} );

const Page = () => {
	const [ error, setError ] = useState( '' );
	const [ isPolicyAccepted, acceptPolicy ] = useState( false );
	const [ isInitializing, markAsInitializing ] = useState( false );

	const initialize = () => {
		setError( '' );
		markAsInitializing( true );
	};

	useEffect( () => {
		if ( ! isInitializing ) {
			return;
		} //end if
		apiFetch( {
			path: '/nelio-content/v1/site/free',
			method: 'POST',
		} )
			.then( () => window.location.reload() )
			.catch( ( e: Dict< string > ) => {
				setError( e.message ?? '' );
				markAsInitializing( false );
			} );
	}, [ isInitializing ] );

	return (
		<div className="nelio-content-welcome-page">
			<Header />
			<TermsAndPrivacy
				disabled={ isInitializing }
				checked={ isPolicyAccepted }
				onChange={ acceptPolicy }
			/>
			<InitializeButton
				disabled={ isInitializing || ! isPolicyAccepted }
				onClick={ initialize }
				isRunning={ isInitializing }
			/>
			<Error error={ error } />
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const Header = () => (
	<>
		<div>
			<Logo className="nelio-content-welcome-page__logo" />
		</div>

		<div className="nelio-content-welcome-page__subtitle">
			{ _x(
				'Auto-post, schedule, and share your posts on social media. Save time with useful automations.',
				'user',
				'nelio-content'
			) }
		</div>

		<div className="nelio-content-welcome-page__intro">
			{ createInterpolateElement(
				sprintf(
					/* translators: plugin name (Nelio Content) */
					_x( '%s is almost ready!', 'text', 'nelio-content' ),
					'<strong>Nelio Content</strong>'
				),
				{ strong: <strong /> }
			) }
		</div>
	</>
);

const TermsAndPrivacy = ( {
	disabled,
	checked,
	onChange,
}: {
	readonly disabled?: boolean;
	readonly checked: boolean;
	readonly onChange: ( value: boolean ) => void;
} ) => (
	<div className="nelio-content-welcome-page__policy">
		<CheckboxControl
			label={ createInterpolateElement(
				_x(
					'Please accept our <tac>Terms and Conditions</tac> and <policy>Privacy Policy</policy> to start using Nelio Content in this site.',
					'user',
					'nelio-content'
				),
				{
					tac: (
						// @ts-expect-error children prop is set by createInterpolateComponent.
						<ExternalLink href="https://neliosoftware.com/legal-information/nelio-content-terms-conditions/" />
					),
					policy: (
						// @ts-expect-error children prop is set by createInterpolateComponent.
						<ExternalLink href="https://neliosoftware.com/privacy-policy-cookies/" />
					),
				}
			) }
			disabled={ disabled }
			checked={ checked }
			onChange={ onChange }
		/>
	</div>
);

const InitializeButton = ( {
	disabled,
	onClick,
	isRunning,
}: {
	readonly disabled?: boolean;
	readonly onClick: () => void;
	readonly isRunning: boolean;
} ) => (
	<div className="nelio-content-welcome-page__actions">
		<Button
			className="nelio-content-welcome-page__start"
			variant="primary"
			isBusy={ isRunning }
			disabled={ disabled }
			onClick={ onClick }
		>
			{ isRunning
				? _x( 'Loading…', 'text', 'nelio-content' )
				: _x( 'Continue »', 'command', 'nelio-content' ) }
		</Button>
	</div>
);

const Error = ( { error }: { readonly error: Maybe< string > } ) => {
	if ( ! error ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-welcome-page__error">
			<Dashicon icon="warning" />
			{ error }
		</div>
	);
};
