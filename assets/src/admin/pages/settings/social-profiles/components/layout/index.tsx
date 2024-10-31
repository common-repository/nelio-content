/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Popover, SlotFillProvider } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { StrictMode } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { LoadingAnimation, PremiumDialog } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';

import { Title } from '../title';
import { ProfileList } from '../profile-list';
import { ProfileConnectors } from '../profile-connectors';
import { ConnectionDialog } from '../connection-dialog';
import { ProfileSettingsDialog } from '../profile-settings-dialog';

export const Layout = (): JSX.Element => {
	const isLoading = useSelect(
		( select ) =>
			! select( NC_DATA ).hasFinishedResolution( 'getSocialProfiles' )
	);

	const areActionsDisabled = useSelect( ( select ) =>
		select( NC_PROFILE_SETTINGS ).areThereProfilesBeingDeleted()
	);

	if ( isLoading ) {
		return (
			<div className="nelio-content-social-profiles-layout">
				<LoadingAnimation />
			</div>
		);
	} //end if

	return (
		<StrictMode>
			<SlotFillProvider>
				<div className="nelio-content-social-profiles-layout">
					<div className="nelio-content-social-profiles-layout__title-wrapper">
						<Title />
					</div>

					<ProfileList />
					<ProfileConnectors disabled={ areActionsDisabled } />

					<ConnectionDialog />
					<ProfileSettingsDialog />
					<PremiumDialog />

					<Popover.Slot />
				</div>
			</SlotFillProvider>
		</StrictMode>
	);
};
