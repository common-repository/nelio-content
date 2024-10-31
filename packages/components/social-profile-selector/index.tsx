/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find, map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import {
	doesNetworkSupport,
	getNetworkLabel,
	getSupportedNetworks,
	getTargetLabel,
} from '@nelio-content/networks';
import type {
	Maybe,
	SocialNetworkName,
	SocialProfile,
	SocialTargetName,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { StylizedSelectControl } from '../stylized-select-control';

import { ProfileOrNetworkOption } from './profile-or-network-option';
import { ProfileOrNetworkSelection } from './profile-or-network-selection';
import type { OptionData } from './profile-or-network-option';
import { TargetOption } from './target-option';
import type { TargetData } from './target-option';

export type SocialProfileSelectorProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly includeNetworks?: boolean;
	readonly isProfileLocked?: boolean;
	readonly network: SocialNetworkName;
	readonly profileId: Maybe< Uuid >;
	readonly targetName?: SocialTargetName;
	readonly networkFilter?: ( network: SocialNetworkName ) => boolean;
	readonly profileFilter?: ( profile: SocialProfile ) => boolean;
	readonly onChange: ( value: {
		readonly network: SocialNetworkName;
		readonly profileId?: Uuid;
		readonly targetDisplayName?: string;
		readonly targetName?: SocialTargetName;
	} ) => void;
};

export const SocialProfileSelector = ( {
	className = '',
	disabled,
	includeNetworks = false,
	isProfileLocked = false,
	network,
	networkFilter = () => true,
	profileId,
	profileFilter = () => true,
	targetName,
	onChange,
}: SocialProfileSelectorProps ): JSX.Element => {
	const socialProfiles = useSocialProfiles( profileFilter );
	const { targets, isLoadingTargets } = useTargets( profileId, network );
	const networks = NETWORK_OPTIONS.filter( ( { network: n } ) =>
		networkFilter( n )
	);

	const profileValue = !! profileId
		? find( socialProfiles, { id: profileId } )
		: find( networks, { network } );

	const targetOptions = map( targets, ( target ) => ( {
		value: target.name,
		label: target.displayName,
		image: target.image,
	} ) );
	const targetValue = !! targetName
		? find( targetOptions, { value: targetName } )
		: undefined;

	return (
		<div
			className={ `nelio-content-social-profile-selector ${ className }` }
		>
			<StylizedSelectControl< OptionData, false >
				disabled={ disabled || isProfileLocked }
				options={
					includeNetworks
						? [ ...networks, ...socialProfiles ]
						: socialProfiles
				}
				value={ profileValue }
				onChange={ ( value ) => {
					if ( ! value ) {
						return;
					} //end if

					if ( 'network' === value.type ) {
						return onChange( {
							network: value.network,
							profileId: undefined,
							targetDisplayName: undefined,
							targetName: undefined,
						} );
					} //end if

					if ( profileId === value.id ) {
						return;
					} //end if

					onChange( {
						network: value.network,
						profileId: value.id as Uuid,
						targetDisplayName: undefined,
						targetName: undefined,
					} );
				} }
				components={ {
					Option: ProfileOrNetworkOption,
					SingleValue: ProfileOrNetworkSelection,
				} }
			/>

			{ !! targets && (
				<div className="nelio-content-social-profile-selector__targets">
					<StylizedSelectControl< TargetData, false >
						disabled={ disabled || isLoadingTargets }
						placeholder={
							isLoadingTargets
								? _x( 'Loading…', 'text', 'nelio-content' )
								: getTargetLabel( 'selectTarget', network )
						}
						options={ targetOptions }
						value={ targetValue }
						onChange={ ( value ) =>
							onChange( {
								network,
								profileId,
								targetDisplayName: value?.label,
								targetName: value?.value,
							} )
						}
						components={ {
							Option: TargetOption,
						} }
					/>
				</div>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useSocialProfiles = (
	profileFilter: ( profile: SocialProfile ) => boolean
) =>
	useSelect( ( select ) =>
		select( NC_DATA )
			.getSocialProfiles()
			.filter( profileFilter )
			.map( ( profile ) => ( {
				id: profile.id,
				label: profile.displayName,
				network: profile.network,
				type: 'social-profile' as const,
				value: `profile:${ profile.id }`,
			} ) )
	);

const useTargets = ( profileId: Maybe< Uuid >, network: SocialNetworkName ) =>
	useSelect( ( select ) => {
		if ( ! profileId || ! doesNetworkSupport( 'multi-target', network ) ) {
			return {};
		} //end if

		const { getTargetsInProfile } = select( NC_DATA );
		const targets = getTargetsInProfile( profileId );
		return {
			isLoadingTargets: undefined === targets,
			targets: targets || [],
		};
	} );

// ====
// DATA
// ====

const NETWORK_OPTIONS = map( getSupportedNetworks(), ( network ) => ( {
	id: `network:${ network }` as const,
	label: getNetworkLabel( 'name', network ),
	network,
	type: 'network' as const,
	value: `network:${ network }`,
} ) );
