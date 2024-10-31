/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type {
	Maybe,
	SocialNetworkName,
	SocialProfileTarget,
	SocialTargetName,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';
import type { State } from '../store/types';

export const useSelectedTargets =
	(): State[ 'attributes' ][ 'targetNamesByProfile' ] =>
		useSelect( ( select ) =>
			select( NC_SOCIAL_EDITOR ).getSelectedTargets()
		);

export const useSelectedTargetsInProfile = (
	profileId: Maybe< Uuid >
): ReadonlyArray< SocialTargetName > =>
	useSelect( ( select ) => {
		const { getSelectedTargetsInProfile } = select( NC_SOCIAL_EDITOR );
		return profileId ? getSelectedTargetsInProfile( profileId ) : [];
	} );

type UseTargetSelectorPropsResult =
	| {
			readonly isVisible: false;
	  }
	| {
			readonly isVisible: true;
			readonly profileId: Uuid;
			readonly network: SocialNetworkName;
			readonly isLoading: boolean;
			readonly selectedTargetNames: ReadonlyArray< SocialTargetName >;
			readonly targets: ReadonlyArray< SocialProfileTarget >;
	  };
export const useTargetSelectorProps = (): UseTargetSelectorPropsResult =>
	useSelect( ( select ): UseTargetSelectorPropsResult => {
		const { getSocialProfile, getTargetsInProfile } = select( NC_DATA );
		const {
			getProfileIdInTargetSelector,
			getSelectedTargetsInTargetSelector,
			isTargetSelectorVisible,
		} = select( NC_SOCIAL_EDITOR );

		const profileId = getProfileIdInTargetSelector();
		if ( ! profileId ) {
			return { isVisible: false };
		} //end if

		const profile = getSocialProfile( profileId );
		if ( ! isTargetSelectorVisible() || ! profile ) {
			return { isVisible: false };
		} //end if

		const targets = getTargetsInProfile( profileId );
		return {
			profileId,
			network: profile.network,
			isLoading: ! targets,
			isVisible: true,
			selectedTargetNames: getSelectedTargetsInTargetSelector(),
			targets: targets || [],
		};
	} );
