/**
 * External dependencies
 */
import * as React from '@safe-wordpress/element';
import { PartialCheckboxControl } from '@nelio-content/components';
import { getNetworkLabel } from '@nelio-content/networks';
import type { SocialNetworkName } from '@nelio-content/types';

export type NetworkCheckboxProps = {
	readonly checked: boolean;
	readonly children: false | JSX.Element[];
	readonly isPartialCheck: boolean;
	readonly network: SocialNetworkName;
	readonly onChange: ( checked: boolean ) => void;
};

export const NetworkCheckbox = ( {
	checked,
	children,
	isPartialCheck,
	network,
	onChange,
}: NetworkCheckboxProps ): JSX.Element => (
	<li
		className="nelio-content-social-filters__network-and-profiles"
		key={ `nelio-content-social-filters__network-${ network }` }
	>
		<PartialCheckboxControl
			label={ <strong>{ getNetworkLabel( 'name', network ) }</strong> }
			checked={ checked }
			isPartialCheck={ isPartialCheck }
			onChange={ onChange }
		/>
		<ul className="nelio-content-social-filters__profiles">{ children }</ul>
	</li>
);
