/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keyBy, mapValues } from 'lodash';
import { SocialNetworkIcon } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import {
	getNetworkLabel,
	getNetworkKinds,
	doesNetworkSupport,
} from '@nelio-content/networks';
import { listify } from '@nelio-content/utils';
import type {
	SocialKind,
	SocialKindName,
	SocialNetworkName,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';

const ALT_CONN_METHODS = [
	{ type: 'buffer', support: 'buffer-connection', label: 'Buffer' },
	{ type: 'hootsuite', support: 'hootsuite-connection', label: 'Hootsuite' },
] as const;

export type KindSelectorDialogProps = {
	readonly network: SocialNetworkName;
};

export const KindSelectorDialog = ( {
	network,
}: KindSelectorDialogProps ): JSX.Element => {
	const kinds: ReadonlyArray< SocialKind > = getNetworkKinds( network ).length
		? getNetworkKinds( network )
		: [ { id: 'single', label: getNetworkLabel( 'name', network ) } ];
	const isSubscribed = useSelect( ( select ) =>
		select( NC_DATA ).isSubscribed()
	);

	const { closeKindSelectorDialog, openConnectionDialog } =
		useDispatch( NC_PROFILE_SETTINGS );
	const openNativeConnector = ( kind: SocialKindName ) => {
		void closeKindSelectorDialog();
		void openConnectionDialog( network, kind );
	};
	const openAlternativeConnector = (
		dialog: ( typeof ALT_CONN_METHODS )[ number ][ 'type' ]
	) => {
		void closeKindSelectorDialog();
		void openConnectionDialog( dialog, network );
	};
	const close = closeKindSelectorDialog;

	const altConnMethods = ALT_CONN_METHODS.filter( ( { support } ) =>
		doesNetworkSupport( support, network )
	);

	return (
		<Modal
			className="nelio-content-kind-selector-dialog"
			title={ _x( 'Connect Profile', 'text', 'nelio-content' ) }
			isDismissible={ true }
			shouldCloseOnEsc={ true }
			shouldCloseOnClickOutside={ true }
			onRequestClose={ close }
		>
			<div className="nelio-content-kind-selector-dialog__list">
				{ kinds.map( ( { id, label } ) => (
					<Button
						key={ `nc-${ network }-kind-${ id }` }
						className="nelio-content-kind-selector-dialog__connect-button"
						variant="link"
						onClick={ () => openNativeConnector( id ) }
						disabled={ 'twitter' === network && ! isSubscribed }
					>
						<SocialNetworkIcon
							className="nelio-content-kind-selector-dialog__profile-icon"
							network={ network }
							kind={ id }
						/>
						<span>{ label }</span>
					</Button>
				) ) }
			</div>
			{ !! altConnMethods.length && (
				<p className="nelio-content-kind-selector-dialog__alternative">
					{ createInterpolateElement(
						sprintf(
							/* translators: an alternative connection method, like “Buffer” */
							_x( 'Or connect via %s', 'user', 'nelio-content' ),
							listify(
								'or',
								altConnMethods.map(
									( { type, label } ) =>
										`<${ type }>${ label }</${ type }>`
								)
							)
						),
						mapValues(
							keyBy( altConnMethods, 'type' ),
							( { type } ) => (
								<Button
									variant="link"
									onClick={ () =>
										openAlternativeConnector( type )
									}
								/>
							)
						)
					) }
				</p>
			) }
			{ 'twitter' === network && <TwitterNotice /> }
		</Modal>
	);
};

// ============
// HELPER VIEWS
// ============

const TwitterNotice = () => {
	const isSubscribed = useSelect( ( select ) =>
		select( NC_DATA ).isSubscribed()
	);

	return (
		<p className="nelio-content-kind-selector-dialog__notice">
			<strong>{ _x( 'Notice:', 'text', 'nelio-content' ) }</strong>{ ' ' }
			{ isSubscribed
				? _x(
						'Due to recent changes in X’s API, messages posted through a native connection may be restricted, as Nelio Content has a maximum limit of requests allowed for a specific time frame.',
						'text',
						'nelio-content'
				  )
				: _x(
						'Due to recent changes in X’s API, native connections of X profiles are only available to Nelio Content subscribers. If you want to connect a X profile, please use Buffer or Hootsuite instead.',
						'text',
						'nelio-content'
				  ) }
		</p>
	);
};
