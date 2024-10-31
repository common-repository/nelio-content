/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Tooltip } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { filter } from 'lodash';
import { SocialNetworkIcon } from '@nelio-content/components';
import {
	store as NC_DATA,
	useFeatureGuard,
	useIsSubscribed,
} from '@nelio-content/data';
import {
	doesNetworkSupport,
	getNetworkKinds,
	getNetworkLabel,
} from '@nelio-content/networks';

/**
 * Internal dependencies
 */
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';

import type { SocialKind, SocialNetworkName } from '@nelio-content/types';

export type ProfileConnectorProps = {
	readonly network: SocialNetworkName;
	readonly disabled?: boolean;
};

export const ProfileConnector = ( {
	network,
	disabled,
}: ProfileConnectorProps ): JSX.Element => {
	const { openConnectionDialog, openKindSelectorDialog } =
		useDispatch( NC_PROFILE_SETTINGS );
	const isSubscribed = useIsSubscribed();
	const isWithinLimits = useIsWithinLimits( network );
	const newLabel = getNetworkLabel( 'add', network );
	const kinds: ReadonlyArray< SocialKind > = getNetworkKinds( network ).length
		? getNetworkKinds( network )
		: [ { id: 'single', label: getNetworkLabel( 'name', network ) } ];

	const guard = useNetworkGuard( network );
	const startConnection = guard( () => {
		if (
			kinds.length === 1 &&
			! doesNetworkSupport( 'buffer-connection', network ) &&
			! doesNetworkSupport( 'hootsuite-connection', network )
		) {
			void openConnectionDialog(
				network,
				( kinds[ 0 ] as SocialKind ).id
			);
		} else {
			void openKindSelectorDialog( network );
		} //end if
	} );

	if ( isSubscribed && ! isWithinLimits ) {
		return (
			<Tooltip
				placement="bottom"
				text={ _x(
					'You’ve reached the maximum number of allowed profiles',
					'user',
					'nelio-content'
				) }
			>
				<div className="nelio-content-profile-connectors__connect-button">
					<SocialNetworkIcon network={ network } disabled />
				</div>
			</Tooltip>
		);
	} //end if

	if ( disabled ) {
		return (
			<div className="nelio-content-profile-connectors__connect-button">
				<SocialNetworkIcon network={ network } disabled />
			</div>
		);
	} //end if

	return (
		<Tooltip position="bottom center" text={ newLabel }>
			<Button
				className={ classnames( {
					'nelio-content-profile-connectors__connect-button': true,
					'nelio-content-profile-connectors__connect-button--is-blurred':
						! isWithinLimits,
				} ) }
				variant="link"
				onClick={ startConnection }
			>
				<SocialNetworkIcon network={ network } />
			</Button>
		</Tooltip>
	);
};

// =====
// HOOKS
// =====

const useIsWithinLimits = ( network: SocialNetworkName ): boolean =>
	'available' === useNetworkStatus( network );

const useNetworkGuard = ( network: SocialNetworkName ) => {
	const status = useNetworkStatus( network );
	return useFeatureGuard(
		'network-locked' === status
			? 'settings/more-profiles-in-network'
			: 'settings/more-profiles',
		'available' !== status
	);
};

const useNetworkStatus = ( network: SocialNetworkName ) =>
	useSelect(
		( select ): 'available' | 'network-locked' | 'all-networks-locked' => {
			const { getPluginLimits, getSocialProfiles } = select( NC_DATA );
			const { maxProfiles, maxProfilesPerNetwork } = getPluginLimits();

			const profiles = getSocialProfiles();
			if ( profiles.length >= maxProfiles ) {
				return 'all-networks-locked';
			} //end if

			const profilesInNetwork = filter( profiles, { network } );
			if ( profilesInNetwork.length >= maxProfilesPerNetwork ) {
				return 'network-locked';
			} //end if

			return 'available';
		}
	);
