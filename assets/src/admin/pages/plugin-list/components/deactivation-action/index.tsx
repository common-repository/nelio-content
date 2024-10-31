/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Button, Dashicon, Modal } from '@safe-wordpress/components';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { RadioControl } from '@nelio-content/components';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type DeactivationActionProps = {
	readonly cleanNonce: string;
	readonly deactivationUrl: Url;
	readonly isSubscribed: boolean;
	readonly isDisabled?: boolean;
};

type State = {
	readonly isModalOpen: boolean;
	readonly isDeactivating: boolean;
	readonly reason: {
		readonly value:
			| 'temporary-deactivation'
			| 'clean-stuff'
			| 'plugin-no-longer-needed'
			| 'plugin-doesnt-work'
			| 'better-plugin-found'
			| 'other';
		readonly details: string;
	};
};

export const DeactivationAction = (
	props: DeactivationActionProps
): JSX.Element => {
	const { isDisabled = false, isSubscribed } = props;
	const {
		// Modal state.
		isModalOpen,
		openModal,
		closeModal,
		mainActionLabel,
		// Deactivation state.
		isDeactivating,
		deactivate,
		cleanAndDeactivate,
		// Reason.
		reason,
		setReason,
	} = useModalState( props );

	return (
		<div className="nelio-content-deactivation">
			<Button
				className="nelio-content-deactivation__button"
				disabled={ isDisabled }
				onClick={ openModal }
				variant="link"
			>
				{ _x( 'Deactivate', 'command', 'nelio-content' ) }
			</Button>

			{ isModalOpen && (
				<Modal
					title={ _x(
						'Nelio Content Deactivation',
						'text',
						'nelio-content'
					) }
					isDismissible={ ! isDeactivating }
					shouldCloseOnEsc={ ! isDeactivating }
					shouldCloseOnClickOutside={ ! isDeactivating }
					onRequestClose={ closeModal }
				>
					{ 'temporary-deactivation' === reason.value ? (
						<>
							<RadioControl
								selected={ reason.value }
								options={ DEACTIVATION_MODES }
								onChange={ ( value ) =>
									isDeactivationReason( value ) &&
									setReason( { value, details: '' } )
								}
								disabled={ isDeactivating }
							/>
							<br />
						</>
					) : (
						<>
							<p>
								{ _x(
									'If you have a moment, please share why you are deactivating Nelio Content:',
									'user',
									'nelio-content'
								) }
							</p>

							<RadioControl
								className="nelio-content-deactivation__options"
								selected={ reason.value }
								options={ DEACTIVATION_REASONS }
								onChange={ ( value ) =>
									isDeactivationReason( value ) &&
									setReason( { value, details: '' } )
								}
								extraValue={ reason.details }
								onExtraChange={ ( details ) =>
									setReason( { ...reason, details } )
								}
								disabled={ isDeactivating }
							/>
						</>
					) }

					{ isSubscribed &&
						'temporary-deactivation' !== reason.value && (
							<p className="nelio-content-deactivation__subscription-warning">
								<Dashicon icon="warning" />
								<span>
									{ _x(
										'Please keep in mind your subscription to Nelio Content will remain active after removing the plugin from this site. If you want to unsubscribe from our service, you can do so from the plugin’s Account page before you deactivate the plugin.',
										'user',
										'nelio-content'
									) }
								</span>
							</p>
						) }

					<div className="nelio-content-deactivation__actions">
						{ 'temporary-deactivation' === reason.value ||
						isDeactivating ? (
							<span></span>
						) : (
							<Button
								variant="link"
								disabled={ isDeactivating }
								onClick={ () => cleanAndDeactivate() }
							>
								{ _x(
									'Just Delete Data',
									'command',
									'nelio-content'
								) }
							</Button>
						) }

						<Button
							variant="primary"
							disabled={
								isDeactivating || 'clean-stuff' === reason.value
							}
							onClick={ () =>
								'temporary-deactivation' === reason.value
									? deactivate()
									: cleanAndDeactivate(
											! reason.details
												? reason.value
												: `${ reason.value }: ${ reason.details }`
									  )
							}
						>
							{ mainActionLabel }
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useModalState = ( {
	cleanNonce,
	deactivationUrl,
}: DeactivationActionProps ) => {
	const [ state, setState ] = useState< State >( INIT_STATE );

	const redirect = () => {
		window.location.href = deactivationUrl; // phpcs:ignore
	};

	const openModal = () =>
		setState( {
			...INIT_STATE,
			isModalOpen: true,
		} );

	const closeModal = () =>
		setState( {
			...INIT_STATE,
			isModalOpen: false,
		} );

	const deactivate = () => {
		setState( {
			...state,
			reason: INIT_STATE.reason,
			isDeactivating: true,
		} );
		redirect();
	};

	const cleanAndDeactivate = ( reason?: string ): void => {
		setState( { ...state, isDeactivating: true } );
		apiFetch( {
			path: '/nelio-content/v1/plugin/clean',
			method: 'POST',
			data: { reason, _nonce: cleanNonce },
		} ).then(
			redirect, // on success
			closeModal // on error
		);
	};

	const setReason = ( reason: State[ 'reason' ] ) =>
		setState( { ...state, reason } );

	const mainActionLabel =
		'temporary-deactivation' === state.reason.value
			? getDeactivationLabel( state.isDeactivating )
			: getCleanAndDeactivateLabel( state.isDeactivating );

	return {
		isModalOpen: state.isModalOpen,
		openModal,
		closeModal,

		isDeactivating: state.isDeactivating,
		mainActionLabel,
		deactivate,
		cleanAndDeactivate,

		reason: state.reason,
		setReason,
	};
};

const getDeactivationLabel = ( isDeactivating: boolean ) =>
	isDeactivating
		? _x( 'Deactivating…', 'text', 'nelio-content' )
		: _x( 'Deactivate', 'command', 'nelio-content' );

const getCleanAndDeactivateLabel = ( isDeleting: boolean ) =>
	isDeleting
		? _x( 'Deleting Data…', 'text', 'nelio-content' )
		: _x( 'Submit and Delete Data', 'command', 'nelio-content' );

// ====
// DATA
// ====

const INIT_STATE: State = {
	isModalOpen: false,
	isDeactivating: false,
	reason: {
		value: 'temporary-deactivation',
		details: '',
	},
};

const DEACTIVATION_MODES: ReadonlyArray< {
	readonly value: State[ 'reason' ][ 'value' ];
	readonly label: string;
} > = [
	{
		value: 'temporary-deactivation',
		label: _x( 'It’s a temporary deactivation', 'text', 'nelio-content' ),
	},
	{
		value: 'clean-stuff',
		label: _x(
			'Delete Nelio Content’s data and deactivate plugin',
			'text',
			'nelio-content'
		),
	},
];

const DEACTIVATION_REASONS: ReadonlyArray< {
	readonly value: State[ 'reason' ][ 'value' ];
	readonly label: string;
	readonly extra?: string;
} > = [
	{
		value: 'plugin-no-longer-needed',
		label: _x( 'I no longer need the plugin', 'text', 'nelio-content' ),
	},
	{
		value: 'plugin-doesnt-work',
		label: _x(
			'I couldn’t get the plugin to work',
			'text',
			'nelio-content'
		),
		extra: _x( 'What went wrong?', 'text', 'nelio-content' ),
	},
	{
		value: 'better-plugin-found',
		label: _x( 'I found a better plugin', 'text', 'nelio-content' ),
		extra: _x( 'What’s the plugin’s name?', 'text', 'nelio-content' ),
	},
	{
		value: 'other',
		label: _x( 'Other', 'text', 'nelio-content' ),
		extra: _x( 'Please share the reason…', 'user', 'nelio-content' ),
	},
];

// =======
// HELPERS
// =======

const reasonsRecord: Record< State[ 'reason' ][ 'value' ], boolean > = {
	'temporary-deactivation': true,
	'clean-stuff': true,
	'plugin-no-longer-needed': true,
	'plugin-doesnt-work': true,
	'better-plugin-found': true,
	other: true,
};
const reasons = Object.keys( reasonsRecord );
const isDeactivationReason = ( s: string ): s is State[ 'reason' ][ 'value' ] =>
	reasons.includes( s );
