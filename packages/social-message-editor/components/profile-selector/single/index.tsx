/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { SocialProfileSelector } from '@nelio-content/components';
import { doesNetworkSupport } from '@nelio-content/networks';
import type { SocialTargetName, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_SOCIAL_EDITOR } from '../../../store';
import {
	useActiveNetwork,
	useAvailableProfiles,
	useSelectedProfiles,
	useIsSingleProfileLocked,
	useSelectedTargetsInProfile,
} from '../../../hooks';

export type SingleProfileSelectorProps = {
	readonly disabled?: boolean;
};

export const SingleProfileSelector = ( {
	disabled,
}: SingleProfileSelectorProps ): JSX.Element | null => {
	const isProfileLocked = useIsSingleProfileLocked();

	const [ network ] = useActiveNetwork();
	const [ selectedProfiles ] = useSelectedProfiles();
	const profileId = selectedProfiles[ 0 ];

	const selectProfile = useProfileSelector();
	const targetName = useSelectedTargetsInProfile( profileId )[ 0 ];

	const profiles = useAvailableProfiles();
	const hasMultipleProfiles = 1 < profiles.length;
	const isMultiTarget = doesNetworkSupport( 'multi-target', network );

	if ( ! hasMultipleProfiles && ! isMultiTarget ) {
		return null;
	} //end if

	return (
		<SocialProfileSelector
			className="nelio-content-single-profile-selector"
			isProfileLocked={ isProfileLocked }
			disabled={ disabled }
			network={ network }
			profileId={ profileId }
			targetName={ targetName }
			onChange={ ( { profileId: pid, targetName: tn } ) =>
				pid ? selectProfile( pid, tn ) : undefined
			}
		/>
	);
};

// =====
// HOOKS
// =====

const useProfileSelector = () => {
	const {
		selectSingleSocialProfile: selectProfile,
		selectSingleTarget: selectTarget,
	} = useDispatch( NC_SOCIAL_EDITOR );
	return ( profileId: Uuid, targetName?: SocialTargetName ) =>
		! targetName
			? selectProfile( profileId )
			: selectTarget( profileId, targetName );
};
