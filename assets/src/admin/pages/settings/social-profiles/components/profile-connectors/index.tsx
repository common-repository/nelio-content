/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { getSupportedNetworks } from '@nelio-content/networks';

/**
 * Internal dependencies
 */
import './style.scss';

import { ProfileConnector } from './profile-connector';

export type ProfileConnectorsProps = {
	readonly disabled?: boolean;
};

export const ProfileConnectors = ( {
	disabled,
}: ProfileConnectorsProps ): JSX.Element => (
	<div className="nelio-content-profile-connectors">
		{ getSupportedNetworks().map( ( network ) => (
			<ProfileConnector
				key={ network }
				network={ network }
				disabled={ disabled }
			/>
		) ) }
	</div>
);
