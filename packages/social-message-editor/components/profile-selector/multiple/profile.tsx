/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Tooltip } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { SocialProfileIcon } from '@nelio-content/components';
import { useSocialProfile } from '@nelio-content/data';
import { doesNetworkSupport, getTargetLabel } from '@nelio-content/networks';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../../store';
import {
	useSelectedProfiles,
	useSelectedTargetsInProfile,
} from '../../../hooks';

export type SocialProfileProps = {
	readonly disabled?: boolean;
	readonly profileId: Uuid;
};

export const SocialProfile = ( {
	disabled,
	profileId,
}: SocialProfileProps ): JSX.Element => {
	const profile = useSocialProfile( profileId );
	const [ selectedProfiles, toggleProfile ] = useSelectedProfiles();
	const selectedTargets = useSelectedTargetsInProfile( profileId );
	const { openTargetSelector } = useDispatch( NC_SOCIAL_EDITOR );

	const numberOfSelectedTargets = selectedTargets.length;
	const hasSelectedTargets = !! numberOfSelectedTargets;
	const isPulsing = ! selectedProfiles.length;
	const isSelected =
		selectedProfiles.includes( profileId ) || hasSelectedTargets;

	const { displayName = '', network } = profile || {};
	const isMultiTarget = doesNetworkSupport( 'multi-target', network );

	return (
		<Tooltip text={ displayName } { ...{ delay: 0 } }>
			<li
				className={ classnames( {
					'nelio-content-multiple-profile-selector__profile': true,
					'nelio-content-multiple-profile-selector__profile--is-pulsing':
						isPulsing,
					'nelio-content-multiple-profile-selector__profile--is-selected':
						isSelected,
					'nelio-content-multiple-profile-selector__profile--is-disabled':
						disabled,
					'nelio-content-multiple-profile-selector__profile--is-multi-target':
						isMultiTarget,
				} ) }
			>
				<span className="screen-reader-text">{ `${ displayName }: ` }</span>

				{ !! isMultiTarget ? (
					<input
						className="nelio-content-multiple-profile-selector__profile-input-field"
						disabled={ disabled }
						type="button"
						value={
							network
								? getTargetLabel( 'selectTargets', network )
								: ''
						}
						onClick={ () => openTargetSelector( profileId ) }
					/>
				) : (
					<input
						className="nelio-content-multiple-profile-selector__profile-input-field"
						disabled={ disabled }
						type="checkbox"
						checked={ !! isSelected }
						onChange={ () => toggleProfile( profileId ) }
					/>
				) }

				<div className="nelio-content-multiple-profile-selector__icon-and-indicator">
					<SocialProfileIcon
						className={ classnames( {
							'nelio-content-multiple-profile-selector__profile-icon':
								true,
							'nelio-content-multiple-profile-selector__profile-icon--is-pulsing':
								isPulsing,
							'nelio-content-multiple-profile-selector__profile-icon--is-selected':
								isSelected,
						} ) }
						profileId={ profileId }
						isNetworkHidden={ true }
					/>

					<div
						className={ classnames( {
							'nelio-content-multiple-profile-selector__profile-indicator':
								true,
							'nelio-content-multiple-profile-selector__profile-indicator--is-pulsing':
								isPulsing,
							'nelio-content-multiple-profile-selector__profile-indicator--is-selected':
								isSelected,
							'nelio-content-multiple-profile-selector__profile-indicator--uses-targets':
								isMultiTarget,
							[ `nelio-content-multiple-profile-selector__profile-indicator--has-${
								numberOfSelectedTargets < 10
									? numberOfSelectedTargets
									: '9-plus'
							}-selected-targets` ]: !! numberOfSelectedTargets,
						} ) }
					></div>
				</div>
			</li>
		</Tooltip>
	);
};
