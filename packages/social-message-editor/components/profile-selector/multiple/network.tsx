/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { doesNetworkSupport, getNetworkLabel } from '@nelio-content/networks';
import type { SocialNetworkName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { useAvailableProfiles, useSelectedProfiles } from '../../../hooks';

export type SocialNetworkProps = {
	readonly disabled?: boolean;
	readonly isActive: boolean;
	readonly isSelected: boolean;
	readonly network: SocialNetworkName;
	readonly onSelect: () => void;
};

export const SocialNetwork = ( {
	disabled,
	isActive,
	isSelected,
	network,
	onSelect,
}: SocialNetworkProps ): JSX.Element => {
	const availableProfiles = useAvailableProfiles();
	const [ selectedProfiles, toggleProfile ] = useSelectedProfiles();
	const isMultiTarget = doesNetworkSupport( 'multi-target', network );

	const profilesOfNetwork = availableProfiles.filter(
		( profile ) => profile.network === network
	);

	const toggleAllProfiles = () => {
		if ( isMultiTarget ) {
			return;
		} //end if

		const selectedProfilesOfNetwork = profilesOfNetwork.filter( ( p ) =>
			selectedProfiles.includes( p.id )
		);

		const areAllProfilesSelected =
			selectedProfilesOfNetwork.length === profilesOfNetwork.length;

		if ( areAllProfilesSelected ) {
			profilesOfNetwork.forEach( ( p ) => toggleProfile( p.id ) );
		} else {
			profilesOfNetwork.forEach(
				( p ) =>
					selectedProfiles.includes( p.id ) || toggleProfile( p.id )
			);
		} //end
	};

	return (
		<div
			className={ classnames( {
				'nelio-content-multiple-profile-selector__network': true,
				'nelio-content-multiple-profile-selector__network--has-arrow':
					isActive,
				'nelio-content-multiple-profile-selector__network--is-disabled':
					disabled,
				[ `nelio-content-multiple-profile-selector__network--is-${ network }` ]:
					true,
				[ `nelio-content-multiple-profile-selector__network--is-${ network }-active` ]:
					isActive,
				[ `nelio-content-multiple-profile-selector__network--is-${ network }-selected` ]:
					isSelected,
				[ `nelio-content-multiple-profile-selector__network--is-${ network }-disabled` ]:
					disabled,
			} ) }
		>
			<input
				type="radio"
				id="nelio-content-multiple-profile-selector__network-input-field"
				className="nelio-content-multiple-profile-selector__network-input-field"
				disabled={ disabled }
				value={ network }
				onChange={ ( ev ) => ev.target.checked && onSelect() }
				checked={ isActive }
				onDoubleClick={ toggleAllProfiles }
				title={ getNetworkLabel( 'name', network ) || undefined }
			/>

			<span className="screen-reader-text">{ network }</span>
		</div>
	);
};
