/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { createInterpolateElement, useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ProfileCreator } from '@nelio-content/components';
import { useSocialProfile } from '@nelio-content/data';
import { doesNetworkSupport } from '@nelio-content/networks';
import { createSocialTemplate } from '@nelio-content/utils';
import type {
	AutomationGroupId,
	ProfileAutomationSettings,
	SocialTemplate,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useAutomationGroup } from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

import { SocialTemplates } from '../social-templates';
import { TabSelector } from '../tab-selector';
import type { Tab } from '../tab-selector';

const MAX_AUTO_MESSAGES_PER_PROFILE = 20;

export type ProfileSettingsProps = {
	readonly groupId: AutomationGroupId;
	readonly profileId: Uuid;
};

export const ProfileSettings = (
	props: ProfileSettingsProps
): JSX.Element | null => {
	const { groupId, profileId } = props;
	const [ tab, setTab ] = useState< Tab >( 'publication' );
	const profile = useSocialProfile( profileId );
	const supportsSocialTemplates = useSupportsSocialTemplates( profileId );
	const [ settings ] = useProfileSettings( groupId, profileId );

	if ( ! profile || ! settings ) {
		return null;
	} //end if

	const areTemplatesVisible =
		supportsSocialTemplates && !! settings[ tab ].enabled;

	return (
		<div className="nelio-content-automation-profile-settings">
			<div className="nelio-content-automation-profile-settings__header">
				<div className="nelio-content-automation-profile-settings__profile-details">
					<h3 className="nelio-content-automation-profile-settings__profile-name">
						{ profile.displayName }
					</h3>
					<ProfileCreator
						className="nelio-content-automation-profile-settings__profile-creator"
						profileId={ profileId }
					/>
				</div>
				<TabSelector
					className="nelio-content-automation-profile-settings__tab-selector"
					tab={ tab }
					setTab={ setTab }
				/>
			</div>
			<div className="nelio-content-automation-profile-settings__content">
				<SharingSettings type={ tab } { ...props } />
				{ areTemplatesVisible && (
					<SocialTemplates
						groupId={ groupId }
						profileId={ profileId }
						mode={ tab }
					/>
				) }
			</div>
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const SharingSettings = ( {
	type,
	...props
}: ProfileSettingsProps & {
	readonly type: 'publication' | 'reshare';
} ): JSX.Element | null => {
	const { groupId, profileId } = props;
	const [ settings, setSettings ] = useProfileSettings( groupId, profileId );
	const group = useAutomationGroup( groupId );
	const hasNetworkTemplates = useHasNetworkTemplates(
		groupId,
		profileId,
		type
	);

	if ( ! group || ! settings ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-automation-profile-settings__sharing-settings">
			<CheckboxControl
				checked={ settings[ type ].enabled }
				onChange={ () => {
					const hasTemplates =
						hasNetworkTemplates ||
						!! settings[ type ].templates.length;
					const enabled = ! settings[ type ].enabled;
					const templates = settings[ type ].templates;

					const defaultTemplates: ReadonlyArray< SocialTemplate > = [
						createSocialTemplate( {
							groupId: group.id,
							text: '{title} {permalink}',
							network: settings.network,
							profileId: props.profileId,
							postType: undefined,
						} ),
						createSocialTemplate( {
							groupId: group.id,
							text: '{highlight} {permalink}',
							network: settings.network,
							profileId: props.profileId,
							postType: undefined,
						} ),
						createSocialTemplate( {
							groupId: group.id,
							text: '{phrase} {permalink}',
							network: settings.network,
							profileId: props.profileId,
							postType: undefined,
						} ),
					];

					void setSettings( {
						...settings,
						[ type ]: {
							...settings[ type ],
							enabled,
							templates:
								enabled && ! hasTemplates
									? defaultTemplates
									: templates,
						},
					} );
				} }
				label={
					<SharingLabel
						profileId={ props.profileId }
						enabled={ settings[ type ].enabled }
						type={ type }
					/>
				}
			/>
		</div>
	);
};

const SharingLabel = ( {
	enabled,
	profileId,
	type,
}: {
	readonly enabled: boolean;
	readonly profileId: Uuid;
	readonly type: 'publication' | 'reshare';
} ): JSX.Element => {
	const [ limit, setLimit ] = useProfileFrequencies( profileId, type );

	if ( ! enabled ) {
		return (
			<>
				{ 'publication' === type
					? _x(
							'Share content on publication',
							'command',
							'nelio-content'
					  )
					: _x( 'Reshare content', 'command', 'nelio-content' ) }
			</>
		);
	} //end if

	const bound = ( n: number ) =>
		Math.min( MAX_AUTO_MESSAGES_PER_PROFILE, Math.max( 1, n ) );

	const fullLabel =
		'publication' === type
			? /* translators: number of social messages */
			  _x(
					'Share content on publication using up to %s messages',
					'command',
					'nelio-content'
			  )
			: /* translators: number of social messages */
			  _x(
					'Reshare content using up to %s daily messages',
					'command',
					'nelio-content'
			  );

	return createInterpolateElement( sprintf( fullLabel, '<value/>' ), {
		value: (
			<input
				type="number"
				style={ { width: '4.5em' } }
				min="1"
				max={ MAX_AUTO_MESSAGES_PER_PROFILE }
				value={ bound( limit ) }
				onChange={ ( ev ) => {
					const text = ev.target.value;
					const value = Number.parseInt( text );
					if ( ! isNaN( value ) ) {
						void setLimit( bound( value ) );
					} //end if
				} }
			/>
		),
	} );
};

// =====
// HOOKS
// =====

const useSupportsSocialTemplates = ( profileId: Uuid ) => {
	const profile = useSocialProfile( profileId );
	return (
		!! profile && doesNetworkSupport( 'profile-template', profile.network )
	);
};

const useProfileSettings = ( groupId: AutomationGroupId, profileId: Uuid ) => {
	const settings = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getProfileAutomationSettings(
			groupId,
			profileId
		)
	);
	const { addProfileSettings } = useDispatch( NC_AUTOMATION_SETTINGS );
	const setSettings = ( s: Partial< ProfileAutomationSettings > ) => {
		if ( ! settings ) {
			return;
		} //end if
		return addProfileSettings( groupId, { ...settings, ...s } );
	};
	return [ settings, setSettings ] as const;
};

const useHasNetworkTemplates = (
	groupId: AutomationGroupId,
	profileId: Uuid,
	type: 'publication' | 'reshare'
) => {
	const group = useAutomationGroup( groupId );
	const network = group?.profileSettings[ profileId ]?.network;
	return (
		!! network &&
		!! group?.networkSettings[ network ]?.[ type ].templates.length
	);
};

const useProfileFrequencies = (
	profileId: Uuid,
	type: 'publication' | 'reshare'
) => {
	const value = useSelect(
		( select ) =>
			select( NC_AUTOMATION_SETTINGS ).getProfileFrequencies(
				profileId
			)?.[ type ] ?? 1
	);
	const { setProfileFrequencies } = useDispatch( NC_AUTOMATION_SETTINGS );
	const setValue = ( n: number ) =>
		setProfileFrequencies( profileId, { [ type ]: n } );
	return [ value, setValue ] as const;
};
