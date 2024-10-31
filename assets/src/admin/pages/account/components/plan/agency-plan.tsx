/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Popover, TextControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ConfirmationDialog } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { Title } from './title';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

/**
 * Export
 */
export const AgencyPlan = (): JSX.Element | null => {
	const account = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getAccount()
	);

	if ( account.plan === 'free' ) {
		return null;
	} //end if

	const { plan, period, state, mode } = account;

	return (
		<div className="nelio-content-account-container__box nelio-content-plan">
			<div className="nelio-content-plan__content">
				<Title
					isCanceled={ 'canceled' === state }
					isInvitation={ 'invitation' === mode }
					plan={ plan }
					period={ period }
				/>

				<div className="nelio-content-plan__renewal">
					{ _x(
						'You’re currently using an agency subscription plan.',
						'user',
						'nelio-content'
					) }
				</div>
			</div>
			<div className="nelio-content-plan__actions">
				<DowngradeButton />
				<ViewDetailsButton />
			</div>
		</div>
	);
};

const DowngradeButton = () => {
	const siteId = useSiteId();
	const [ isOpen, setIsOpen ] = useState( false );
	const { removeLicense } = useDispatch( NC_ACCOUNT );
	const isLocked = useIsInterfaceLocked();

	const open = () => setIsOpen( true );
	const close = () => setIsOpen( false );
	const confirm = () => {
		close();
		void removeLicense( siteId );
	};

	return (
		<>
			<Button
				isDestructive
				className="nelio-content-plan__action"
				onClick={ open }
				disabled={ isLocked }
			>
				{ _x(
					'Downgrade to Free Version',
					'command',
					'nelio-content'
				) }
			</Button>
			<ConfirmationDialog
				title={ _x(
					'Downgrade to Free version?',
					'text',
					'nelio-content'
				) }
				text={ _x(
					'This will remove the subscription license from the site and you’ll be using Nelio Content’s free version.',
					'text',
					'nelio-content'
				) }
				confirmLabel={ _x( 'Downgrade', 'command', 'nelio-content' ) }
				isOpen={ isOpen }
				onCancel={ close }
				onConfirm={ confirm }
			/>
		</>
	);
};

const ViewDetailsButton = () => {
	const account = useSelect( ( select ) =>
		select( NC_ACCOUNT ).getAccount()
	);

	const isLocked = useIsInterfaceLocked();

	const [ isOpen, setIsOpen ] = useState( false );
	const [ license, setLicense ] = useState( '' );
	const { enableAgencyFullView } = useDispatch( NC_ACCOUNT );

	if ( account.plan === 'free' ) {
		return null;
	} //end if

	const open = () => setIsOpen( true );
	const close = () => setIsOpen( false );
	const validate = () => {
		if ( ! account.license || license !== account.license ) {
			setLicense( '' );
			return;
		} //end if
		void enableAgencyFullView();
		close();
	};

	return (
		<div>
			<Button
				variant="secondary"
				className="nelio-content-plan__action"
				onClick={ open }
				disabled={ isLocked }
			>
				{ _x( 'View Details', 'command', 'nelio-content' ) }
			</Button>
			{ isOpen && (
				<Popover
					noArrow={ false }
					placement="bottom-start"
					onFocusOutside={ close }
				>
					<div className="nelio-content-license-form">
						<TextControl
							value={ license }
							placeholder={ _x(
								'Type your license here',
								'user',
								'nelio-content'
							) }
							className="nelio-content-license-form__text-control"
							onChange={ setLicense }
						/>
						<Button
							variant="primary"
							className="nelio-content-license-form__button"
							onClick={ validate }
							disabled={
								license.length !== account.license.length
							}
						>
							{ _x( 'Validate', 'command', 'nelio-content' ) }
						</Button>
					</div>
				</Popover>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useSiteId = () =>
	useSelect( ( select ) => select( NC_ACCOUNT ).getSiteId() );

const useIsInterfaceLocked = () =>
	useSelect( ( select ) => select( NC_ACCOUNT ).isLocked() );
