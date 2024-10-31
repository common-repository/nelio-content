/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { useAdminUrl, useSocialProfiles } from '@nelio-content/data';
import { doesNetworkSupport } from '@nelio-content/networks';
import type { AutomationGroupId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { SocialProfile } from './profile';

export type ProfileSelectorProps = {
	readonly groupId: AutomationGroupId;
};

export const ProfileSelector = ( {
	groupId,
}: ProfileSelectorProps ): JSX.Element => {
	const profiles = useAvailableSocialProfiles();
	const settingsUrl = useAdminUrl( 'admin.php', {
		page: 'nelio-content-settings',
		subpage: 'social--profiles',
	} );

	return (
		<div className="nelio-content-automation-group-settings__section">
			<p className="nelio-content-automation-group-settings__section-title">
				{ _x(
					'Where should your content be shared?',
					'user',
					'nelio-content'
				) }
			</p>
			<div className="nelio-content-automation-group-settings__section-content">
				{ profiles.length ? (
					<>
						<p className="screen-reader-text">
							{ _x(
								'Select one or more profiles:',
								'text',
								'nelio-content'
							) }
						</p>
						<ul className="nelio-content-automation-group-settings__profile-list">
							{ profiles.map( ( { id } ) => (
								<div
									className="nelio-content-automation-group-settings__profile-list-item"
									key={ id }
								>
									<SocialProfile
										groupId={ groupId }
										profileId={ id }
									/>
								</div>
							) ) }
						</ul>
					</>
				) : (
					<p>
						{ createInterpolateElement(
							_x(
								'There aren’t any social profiles connected to Nelio Content. <a>Connect one first</a> and then configure its auto share settings here.',
								'user',
								'nelio-content'
							),
							{
								a: <a href={ settingsUrl }>.</a>,
							}
						) }
					</p>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAvailableSocialProfiles = () => {
	const profiles = useSocialProfiles();
	return profiles.filter( ( p ) =>
		doesNetworkSupport( 'automations', p.network )
	);
};
