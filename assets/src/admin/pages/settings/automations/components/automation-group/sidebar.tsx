/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';
import { Dashicon, DropdownMenu, Tooltip } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { cloneDeep, mapValues, values } from 'lodash';
import { v4 as uuid } from 'uuid';
import classnames from 'classnames';
import { store as NC_DATA, usePostTypes } from '@nelio-content/data';
import {
	ConfirmationDialog,
	SocialProfileIcon,
} from '@nelio-content/components';
import {
	createAutomationGroupId,
	isUniversalGroup,
	POST,
} from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import {
	useAutomationGroup,
	useIsSaving,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

import type {
	AutomationGroup,
	AutomationGroupId,
	RegularAutomationGroup,
	Uuid,
} from '@nelio-content/types';

export type SidebarProps = {
	readonly activeTab: Tab;
	readonly groupId: AutomationGroupId;
	readonly setActiveTab: ( tab: Tab ) => void;
};

export const Sidebar = ( {
	activeTab,
	groupId,
	setActiveTab,
}: SidebarProps ): JSX.Element | null => {
	const [ isConfirmationVisible, showConfirmation ] = useState( false );
	const isSaving = useIsSaving();
	const tabs = useTabs( groupId );
	const group = useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).getAutomationGroup( groupId )
	);
	const { addAutomationGroup, deleteAutomationGroup } = useDispatch(
		NC_AUTOMATION_SETTINGS
	);
	const duplicateGroup = useGroupDuplicator();

	if ( ! group ) {
		return null;
	}

	return (
		<div className="nelio-content-automation-group__sidebar">
			{ tabs.map( ( tab, id ) => (
				<div
					className={ classnames( {
						'nelio-content-automation-group__sidebar-item': true,
						'nelio-content-automation-group__sidebar-item--active':
							isSameTab( tab, activeTab ),
					} ) }
					key={ id }
					onClick={ () => ! isSaving && setActiveTab( tab ) }
					aria-hidden="true"
				>
					{ tab.type === 'settings' ? (
						<Dashicon icon="admin-settings" />
					) : (
						<Tooltip
							text={ tab.displayName }
							placement="bottom-end"
							{ ...{ delay: 0 } }
						>
							<div className="nelio-content-profile__icon-and-indicator">
								<SocialProfileIcon
									className={ classnames( {
										'nelio-content-profile__profile-icon':
											true,
										'nelio-content-profile__profile-icon--is-selected':
											isSameTab( tab, activeTab ),
										'nelio-content-profile__profile-icon--is-invalid':
											! tab.isValid,
									} ) }
									profileId={ tab.id }
									isNetworkHidden={ false }
								/>
								<div
									className={ classnames( {
										'nelio-content-profile__profile-indicator':
											true,
										'nelio-content-profile__profile-indicator--is-invalid':
											! tab.isValid,
									} ) }
								></div>
							</div>
						</Tooltip>
					) }
				</div>
			) ) }
			<div className="nelio-content-automation-group__sidebar-item nelio-content-automation-group__sidebar-item--is-spacer"></div>
			<div className="nelio-content-automation-group__sidebar-item nelio-content-automation-group__sidebar-actions">
				<DropdownMenu
					icon="admin-generic"
					label={ _x( 'Actions', 'text', 'nelio-content' ) }
					toggleProps={ { disabled: isSaving } }
					controls={ [
						{
							title: _x(
								'Duplicate group',
								'command',
								'nelio-content'
							),
							icon: 'admin-page',
							// eslint-disable-next-line no-console
							onClick: () =>
								addAutomationGroup( duplicateGroup( group ) ),
						},
						...( ! isUniversalGroup( group )
							? [
									{
										title: _x(
											'Remove group',
											'command',
											'nelio-content'
										),
										icon: 'trash',
										onClick: () => showConfirmation( true ),
									} as const,
							  ]
							: [] ),
					] }
				/>
				{ groupId !== 'universal' && (
					<ConfirmationDialog
						isOpen={ isConfirmationVisible }
						confirmLabel={ _x(
							'Delete',
							'command',
							'nelio-content'
						) }
						onConfirm={ () => {
							showConfirmation( false );
							void deleteAutomationGroup( groupId );
						} }
						onCancel={ () => showConfirmation( false ) }
						text={ _x(
							'Are you sure you want to delete this group? This operation can’t be undone.',
							'user',
							'nelio-content'
						) }
						title={ _x( 'Delete group', 'text', 'nelio-content' ) }
					/>
				) }
			</div>
		</div>
	);
};

// ============
// HELPER TYPES
// ============

export type Tab =
	| {
			readonly type: 'settings';
	  }
	| {
			readonly type: 'profile';
			readonly displayName: string;
			readonly id: Uuid;
			readonly isValid: boolean;
	  };

// =====
// HOOKS
// =====

const isSameTab = ( t1: Tab, t2: Tab ): boolean => {
	if ( t1.type !== t2.type ) {
		return false;
	} //end if

	switch ( t1.type ) {
		case 'settings':
			return true;
		case 'profile':
			return t2.type === 'profile' && t1.id === t2.id;
	} //end switch
};

const useTabs = ( groupId: AutomationGroupId ) => {
	const group = useAutomationGroup( groupId );
	return useSelect( ( select ): ReadonlyArray< Tab > => {
		if ( ! group ) {
			return [];
		} //end if

		const selection = values( group.profileSettings )
			.filter( ( ps ) => ps.enabled )
			.map( ( ps ) => ps.profileId );

		const profiles = select( NC_DATA )
			.getSocialProfiles()
			.filter( ( p ) => selection.includes( p.id ) );

		const { getProfileError } = select( NC_AUTOMATION_SETTINGS );

		return [
			{ type: 'settings' },
			...profiles.map( ( p ) => ( {
				displayName: getProfileError( groupId, p.id ) || p.displayName,
				type: 'profile' as const,
				id: p.id,
				isValid: ! getProfileError( groupId, p.id ),
			} ) ),
		];
	} );
}; //end useTabs()

const useGroupDuplicator = () => {
	const defaultPostType = usePostTypes( 'social' )[ 0 ]?.name ?? POST;
	return ( group: AutomationGroup ): RegularAutomationGroup => {
		const regularGroup: RegularAutomationGroup = {
			postType: isUniversalGroup( group )
				? defaultPostType
				: group.postType,
			authors: [],
			taxonomies: {},
			...group,
			id: createAutomationGroupId(),
			name: isUniversalGroup( group )
				? _x( 'Copy of Universal Group', 'text', 'nelio-content' )
				: sprintf(
						/* translators: automation group name */
						_x( 'Copy of %s', 'text', 'nelio-content' ),
						group.name ??
							_x( 'Unnamed Group', 'text', 'nelio-content' )
				  ),
		};
		const clonedGroup = cloneDeep( regularGroup );

		return {
			...clonedGroup,
			name:
				( clonedGroup.name || '' ) +
				' ' +
				_x( '(duplicate)', 'text', 'nelio-content' ),
			profileSettings: mapValues(
				clonedGroup.profileSettings,
				( settings ) => ( {
					...settings,
					publication: {
						...settings,
						templates: settings.publication.templates.map(
							( t ) => ( {
								...t,
								groupId: clonedGroup.id,
								id: uuid(),
							} )
						),
					},
					reshare: {
						...settings.reshare,
						templates: settings.reshare.templates.map( ( t ) => ( {
							...t,
							groupId: clonedGroup.id,
							id: uuid(),
						} ) ),
					},
				} )
			),

			networkSettings: mapValues(
				clonedGroup.networkSettings,
				( settings ) =>
					settings
						? {
								...settings,
								publication: {
									...settings.publication,
									templates:
										settings.publication.templates.map(
											( t ) => ( {
												...t,
												groupId: clonedGroup.id,
												id: uuid(),
											} )
										),
								},
								reshare: {
									...settings.reshare,
									templates: settings.reshare.templates.map(
										( t ) => ( {
											...t,
											groupId: clonedGroup.id,
											id: uuid(),
										} )
									),
								},
						  }
						: undefined
			),
		};
	};
};
