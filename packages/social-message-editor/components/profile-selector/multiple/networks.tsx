/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	useAvailableNetworks,
	useSelectedNetworks,
	useActiveNetwork,
} from '../../../hooks';

import { SocialNetwork } from './network';

export type NetworksProps = {
	readonly disabled?: boolean;
};

export const Networks = ( { disabled }: NetworksProps ): JSX.Element => {
	const [ activeNetwork, setActiveNetwork ] = useActiveNetwork();
	const availableNetworks = useAvailableNetworks();
	const selectedNetworks = useSelectedNetworks();
	return (
		<div className="nelio-content-multiple-profile-selector__networks">
			<p className="screen-reader-text">
				{ _x(
					'Select the network whose profiles you want to use:',
					'user',
					'nelio-content'
				) }
			</p>

			{ availableNetworks.map( ( network ) => (
				<SocialNetwork
					key={ network }
					network={ network }
					disabled={ disabled }
					isSelected={ selectedNetworks.includes( network ) }
					isActive={ network === activeNetwork }
					onSelect={ () => setActiveNetwork( network ) }
				/>
			) ) }
		</div>
	);
};
