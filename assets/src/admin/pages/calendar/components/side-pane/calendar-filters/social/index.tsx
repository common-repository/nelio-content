/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { filter, map, uniq, xor } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { withProfileCheck, store as NC_DATA } from '@nelio-content/data';
import { isEmpty } from '@nelio-content/utils';
import type {
	Maybe,
	SocialNetworkName,
	SocialProfile,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { NetworkCheckbox } from './network-checkbox';
import { ProfileCheckbox } from './profile-checkbox';

export const SocialFilter = withProfileCheck( () => {
	const {
		areAutomaticMessagesVisible,
		areFailedMessagesVisible,
		disabledProfilesByNetwork,
		networks,
		profilesByNetwork,
	} = useSocialFilters();

	const {
		showAutomaticMessages,
		showFailedMessages,
		toggleProfile,
		enableAllProfilesInNetwork,
		disableAllProfilesInNetwork,
	} = useSocialFilterActions();

	return (
		<div className="nelio-content-social-filters">
			<ul>
				<li
					key="nelio-content-social-filters__profile-title"
					className="nelio-content-social-filters__title"
				>
					<strong>
						{ _x( 'Profile Filters', 'text', 'nelio-content' ) }
					</strong>
				</li>

				{ networks.map( ( network ) => {
					const profiles = profilesByNetwork[ network ] || [];
					const disabled = disabledProfilesByNetwork[ network ] || [];

					return (
						<NetworkCheckbox
							key={ `nelio-content-social-filters__network-${ network }` }
							checked={ disabled.length !== profiles.length }
							isPartialCheck={ ! isEmpty( disabled ) }
							network={ network }
							onChange={ ( checked ) =>
								checked
									? enableAllProfilesInNetwork( network )
									: disableAllProfilesInNetwork( network )
							}
						>
							{ 1 < profiles.length &&
								profiles.map( ( { id, displayName } ) => (
									<ProfileCheckbox
										key={ `nelio-content-social-filters__profile-${ id }` }
										label={ displayName }
										checked={ ! disabled.includes( id ) }
										onChange={ () =>
											toggleProfile( network, id )
										}
									/>
								) ) }
						</NetworkCheckbox>
					);
				} ) }

				<li
					key="nelio-content-social-filters__additional-title"
					className="nelio-content-social-filters__title"
				>
					<strong>
						{ _x( 'Additional Filters', 'text', 'nelio-content' ) }
					</strong>
				</li>

				<li key="nelio-content-social-filters__auto">
					<CheckboxControl
						label={ _x(
							'Show automatic social messages',
							'command',
							'nelio-content'
						) }
						checked={ areAutomaticMessagesVisible }
						onChange={ () =>
							showAutomaticMessages(
								! areAutomaticMessagesVisible
							)
						}
					/>
				</li>

				<li key="nelio-content-social-filters__failed">
					<CheckboxControl
						label={ _x(
							'Always show failed social messages',
							'command',
							'nelio-content'
						) }
						checked={ areFailedMessagesVisible }
						onChange={ () =>
							showFailedMessages( ! areFailedMessagesVisible )
						}
					/>
				</li>
			</ul>
		</div>
	);
} );

// =====
// HOOKS
// =====

const useSocialFilters = () =>
	useSelect( ( select ) => {
		const { getSocialProfiles } = select( NC_DATA );
		const {
			areAutomaticMessagesVisible,
			areFailedMessagesVisible,
			getDisabledSocialProfilesByNetwork,
		} = select( NC_CALENDAR );

		const profiles = getSocialProfiles();
		const networks = uniq( map( profiles, 'network' ) );

		const profilesByNetwork: Partial<
			Record< SocialNetworkName, ReadonlyArray< SocialProfile > >
		> = {};
		networks.forEach( ( network ) => {
			profilesByNetwork[ network ] = filter( profiles, { network } );
		} );

		const aux = getDisabledSocialProfilesByNetwork();
		const disabledProfilesByNetwork: Partial<
			Record< SocialNetworkName, ReadonlyArray< Uuid > >
		> = {};
		const pids = map( profiles, 'id' );
		for ( const network of networks ) {
			disabledProfilesByNetwork[ network ] = filter(
				aux[ network ],
				( id ) => pids.includes( id )
			);
		} //end for

		return {
			areAutomaticMessagesVisible: areAutomaticMessagesVisible(),
			areFailedMessagesVisible: areFailedMessagesVisible(),
			networks,
			profilesByNetwork,
			disabledProfilesByNetwork,
		};
	} );

const useSocialFilterActions = () => {
	const { profilesByNetwork, disabledProfilesByNetwork } = useSocialFilters();
	const {
		setDisabledSocialProfilesInNetwork,
		showAutomaticMessages,
		showFailedMessages,
	} = useDispatch( NC_CALENDAR );

	return {
		showAutomaticMessages,
		showFailedMessages,

		toggleProfile: ( network: SocialNetworkName, profile: Uuid ) =>
			setDisabledSocialProfilesInNetwork(
				network,
				toggle( disabledProfilesByNetwork[ network ], profile )
			),

		enableAllProfilesInNetwork: ( network: SocialNetworkName ) =>
			setDisabledSocialProfilesInNetwork( network, [] ),

		disableAllProfilesInNetwork: ( network: SocialNetworkName ) =>
			setDisabledSocialProfilesInNetwork(
				network,
				map( profilesByNetwork[ network ], 'id' )
			),
	};
};

function toggle< T >( arr: Maybe< ReadonlyArray< T > >, x: T ) {
	return xor( arr ?? [], [ x ] );
} //end toggle()
