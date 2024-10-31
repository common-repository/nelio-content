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
import { StylizedSelectControl } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { doesNetworkSupport, getTargetLabel } from '@nelio-content/networks';
import type {
	Maybe,
	SocialNetworkName,
	SocialTargetName,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { TargetOption } from '../../../../../../../../packages/components/social-profile-selector/target-option';
import type { TargetData } from '../../../../../../../../packages/components/social-profile-selector/target-option';

export type TargetSelectorProps = {
	readonly network: SocialNetworkName;
	readonly profileId: Maybe< Uuid >;
	readonly targetName: Maybe< SocialTargetName >;
	readonly onTargetChange: ( name: Maybe< SocialTargetName > ) => void;
};

export const TargetSelector = ( {
	network,
	profileId,
	targetName,
	onTargetChange,
}: TargetSelectorProps ): JSX.Element | null => {
	const { targets, isLoadingTargets } = useTargets( profileId, network );

	if ( ! profileId || ! targets ) {
		return null;
	} //end if

	const targetOptions = map( targets, ( target ) => ( {
		value: target.name,
		label: target.displayName,
		image: target.image,
	} ) );
	const targetValue = !! targetName
		? find( targetOptions, { value: targetName } )
		: undefined;

	return (
		<div className="nelio-content-social-profile-selector__targets">
			<StylizedSelectControl< TargetData, false >
				disabled={ isLoadingTargets }
				placeholder={
					isLoadingTargets
						? _x( 'Loading…', 'text', 'nelio-content' )
						: getTargetLabel( 'selectTarget', network )
				}
				options={ targetOptions }
				value={ targetValue }
				onChange={ ( option ) => onTargetChange( option?.value ) }
				components={ {
					Option: TargetOption,
				} }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTargets = ( profileId: Maybe< Uuid >, network: SocialNetworkName ) =>
	useSelect( ( select ) => {
		select( NC_DATA );

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
