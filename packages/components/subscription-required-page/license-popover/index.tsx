/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import {
	Popover,
	TextControl,
	Button,
	Dashicon,
} from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

const LICENSE_LENGTH = 21;
const OLD_LICENSE_LENGTH = 26;

export type LicensePopoverProps = {
	readonly isOpen: boolean;
	readonly isLocked: boolean;
	readonly lock: ( locked: boolean ) => void;
	readonly onFocusOutside?: () => void;
};

export const LicensePopover = ( {
	isOpen,
	isLocked,
	lock,
	onFocusOutside,
}: LicensePopoverProps ): JSX.Element | null => {
	const [ license, setLicense ] = useState( '' );
	const [ error, setError ] = useState( '' );
	const [ isApplyingLicense, setIsApplyingLicense ] = useState( false );

	const applyLicense = () => {
		try {
			setIsApplyingLicense( true );
			lock( true );

			void apiFetch( {
				path: '/nelio-content/v1/site/use-license',
				method: 'POST',
				data: { license },
			} )
				.then( () => window.location.reload() )
				.catch( ( e ) => {
					setError(
						hasErrorMessage( e )
							? e.message
							: _x( 'Unknown error', 'text', 'nelio-content' )
					);
					setIsApplyingLicense( false );
					lock( false );
				} );
		} catch ( e ) {
			setError(
				hasErrorMessage( e )
					? e.message
					: _x( 'Unknown error', 'text', 'nelio-content' )
			);
			setIsApplyingLicense( false );
			lock( false );
		} //end catch;
	};

	if ( ! isOpen ) {
		return null;
	} //end if

	return (
		<Popover
			placement="bottom"
			onFocusOutside={
				! isLocked && onFocusOutside ? onFocusOutside : undefined
			}
		>
			<>
				<div className="nelio-content-subscription-required-page__license-form">
					<TextControl
						value={ license }
						placeholder={ _x(
							'Type your license here',
							'user',
							'nelio-content'
						) }
						maxLength={ Math.max(
							LICENSE_LENGTH,
							OLD_LICENSE_LENGTH
						) }
						className="nelio-content-subscription-required-page__license-form__text-control"
						disabled={ isLocked }
						onChange={ setLicense }
					/>
					<Button
						variant="primary"
						isBusy={ isApplyingLicense }
						className="nelio-content-subscription-required-page__license-form__button"
						disabled={
							isLocked ||
							( license.length !== LICENSE_LENGTH &&
								license.length !== OLD_LICENSE_LENGTH )
						}
						onClick={ applyLicense }
					>
						{ isApplyingLicense
							? _x( 'Applying…', 'text', 'nelio-content' )
							: _x( 'Apply', 'command', 'nelio-content' ) }
					</Button>
				</div>
				{ !! error && (
					<div className="nelio-content-subscription-required-page__license-form__error-message">
						<Dashicon icon="warning" /> { error }
					</div>
				) }
			</>
		</Popover>
	);
};

const hasErrorMessage = (
	x: unknown
): x is {
	readonly message: string;
} =>
	!! x &&
	'object' === typeof x &&
	'message' in x &&
	typeof x.message === 'string';
