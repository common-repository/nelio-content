/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Tooltip } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { find } from 'lodash';
import { SocialProfileIcon } from '@nelio-content/components';
import { store as NC_DATA, useSocialProfile } from '@nelio-content/data';
import { getNetworkLabel } from '@nelio-content/networks';
import { createSocialTemplate } from '@nelio-content/utils';
import type { AutomationGroupId, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { useAutomationGroup } from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export type SocialProfileProps = {
	readonly groupId: AutomationGroupId;
	readonly profileId: Uuid;
	readonly disabled?: boolean;
};

export const SocialProfile = ( {
	groupId,
	disabled,
	profileId,
}: SocialProfileProps ): JSX.Element => {
	const profile = useSocialProfile( profileId );
	const [ isSelected, setSelected ] = useSelector( groupId, profileId );

	const { displayName = '', network = 'twitter' } = profile || {};

	return (
		<Tooltip
			text={ `${ displayName } (${ getNetworkLabel(
				'name',
				network
			) })` }
			{ ...{ delay: 0 } }
		>
			<li
				className={ classnames( {
					'nelio-content-profile-selector__profile': true,
					'nelio-content-profile-selector__profile--is-selected':
						isSelected,
					'nelio-content-profile-selector__profile--is-disabled':
						disabled,
				} ) }
			>
				<span className="screen-reader-text">{ `${ displayName }: ` }</span>

				<input
					className="nelio-content-profile-selector__profile-input-field"
					disabled={ disabled }
					type="checkbox"
					checked={ !! isSelected }
					onChange={ () => setSelected( ! isSelected ) }
				/>

				<div className="nelio-content-profile-selector__icon-and-indicator">
					<SocialProfileIcon
						className={ classnames( {
							'nelio-content-profile-selector__profile-icon':
								true,
							'nelio-content-profile-selector__profile-icon--is-selected':
								isSelected,
						} ) }
						profileId={ profileId }
						isNetworkHidden={ false }
					/>

					<div
						className={ classnames( {
							'nelio-content-profile-selector__profile-indicator':
								true,
							'nelio-content-profile-selector__profile-indicator--is-selected':
								isSelected,
						} ) }
					></div>
				</div>
			</li>
		</Tooltip>
	);
};

// =====
// HOOKS
// =====

const useSelector = ( groupId: AutomationGroupId, profileId: Uuid ) => {
	const group = useAutomationGroup( groupId );
	const profile = useSelect( ( select ) =>
		select( NC_DATA ).getSocialProfile( profileId )
	);
	const profileSettings = find( group?.profileSettings, { profileId } );

	const { addProfileSettings } = useDispatch( NC_AUTOMATION_SETTINGS );

	const isSelected = !! profileSettings?.enabled;
	const setSelected = ( selected: boolean ) => {
		if ( ! group || ! profile ) {
			return;
		} //end if

		void addProfileSettings( groupId, {
			profileId,
			network: profile.network,
			publication: {
				enabled: true,
				templates: [
					createSocialTemplate( {
						groupId: group.id,
						text: '{title} {permalink}',
						network: profile.network,
						profileId: profile.id,
						postType: undefined,
					} ),
					createSocialTemplate( {
						groupId: group.id,
						text: '{highlight} {permalink}',
						network: profile.network,
						profileId: profile.id,
						postType: undefined,
					} ),
					createSocialTemplate( {
						groupId: group.id,
						text: '{phrase} {permalink}',
						network: profile.network,
						profileId: profile.id,
						postType: undefined,
					} ),
				],
			},
			reshare: {
				enabled: false,
				templates: [],
			},
			...profileSettings,
			enabled: selected,
		} );
	};

	return [ isSelected, setSelected ] as const;
};
