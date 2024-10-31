/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ToggleControl, Tooltip } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { values } from 'lodash';
import classnames from 'classnames';
import { SocialProfileIcon } from '@nelio-content/components';
import { useIsSubscribed, store as NC_DATA } from '@nelio-content/data';
import type { AutomationGroupId, SocialProfile } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import {
	useAutomationGroup,
	useGroupName,
	useIsSaving,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

export type HeaderProps = {
	readonly groupId: AutomationGroupId;
	readonly isActive: boolean;
	readonly isExpanded: boolean;
	readonly onToggle: () => void;
	readonly onToggleActivation: () => void;
};

const AMOUNT_OF_PROFILES_IN_HEADER = 4;

export const Header = ( {
	groupId,
	isActive,
	isExpanded,
	onToggle,
	onToggleActivation,
}: HeaderProps ): JSX.Element => {
	const name = useGroupName( groupId );
	const socialProfiles = useActiveProfiles( groupId );
	const isSaving = useIsSaving();

	return (
		<div
			className="nelio-content-automation-group__header"
			onClick={ onToggle }
			aria-hidden="true"
		>
			<div
				className="nelio-content-automation-group__header-content"
				onClick={ onToggle }
				aria-hidden="true"
			>
				<div
					className="nelio-content-automation-group__header-content-activation-toggle"
					onClick={ ( ev ) => ev.stopPropagation() }
					aria-hidden="true"
				>
					<ToggleControl
						label=""
						checked={ isActive }
						onChange={ onToggleActivation }
						{ ...{ disabled: isSaving } }
					/>
				</div>

				<NotificationIcon
					groupId={ groupId }
					isActive={ isActive }
					isExpanded={ isExpanded }
				/>

				<div className="nelio-content-automation-group__header-content-title">
					{ name }
				</div>

				<div className="nelio-content-automation-group__header-content-icons">
					{ socialProfiles.length <= AMOUNT_OF_PROFILES_IN_HEADER
						? socialProfiles.map( ( { id } ) => (
								<SocialProfileIcon
									key={ id }
									profileId={ id }
								/>
						  ) )
						: socialProfiles
								.slice( 0, AMOUNT_OF_PROFILES_IN_HEADER - 1 )
								.map( ( { id } ) => (
									<SocialProfileIcon
										key={ id }
										profileId={ id }
									/>
								) ) }
					{ socialProfiles.length > AMOUNT_OF_PROFILES_IN_HEADER && (
						<div className="nelio-content-automation-group__header-content-remaining-profiles">
							{ `+${
								socialProfiles.length -
								AMOUNT_OF_PROFILES_IN_HEADER +
								1
							}` }
						</div>
					) }
				</div>
			</div>
			<div className="nelio-content-automation-group__header-toggle">
				<Button
					disabled={ isSaving }
					icon={ isExpanded ? 'arrow-up' : 'arrow-down' }
					onClick={ onToggle }
				/>
			</div>
		</div>
	);
};

// ============
// HELPER VIEWS
// ============

const NotificationIcon = ( {
	groupId,
	isActive,
	isExpanded,
}: Pick<
	HeaderProps,
	'groupId' | 'isActive' | 'isExpanded'
> ): JSX.Element | null => {
	const isValidGroup = useIsValidGroup( groupId );
	const areProfilesSelected = useAreProfilesSelected( groupId );
	const hasRequiredPlan = useIsSubscribed( 'standard' );

	const isErrorVisible =
		( isActive || isExpanded ) &&
		( ! isValidGroup || ( ! isExpanded && ! areProfilesSelected ) );

	if ( isErrorVisible ) {
		return (
			<Tooltip
				text={
					! areProfilesSelected
						? _x(
								'This group does not have any profiles selected',
								'text',
								'nelio-content'
						  )
						: _x(
								'Please review this group’s settings and its active social profiles',
								'user',
								'nelio-content'
						  )
				}
				placement="bottom-end"
				{ ...{ delay: 0 } }
			>
				<div
					className={ classnames( {
						'nelio-content-automation-group--is-invalid':
							! isValidGroup ||
							( ! isExpanded && ! areProfilesSelected ),
						'nelio-content-automation-group--is-expanded':
							isExpanded,
					} ) }
				></div>
			</Tooltip>
		);
	} //end if

	if ( ! hasRequiredPlan && 'universal' !== groupId ) {
		return (
			<Tooltip
				text={ _x(
					'Upgrade to Nelio Content Standard to be able to use this automation group',
					'user',
					'nelio-content'
				) }
				placement="bottom-end"
				{ ...{ delay: 0 } }
			>
				<div
					className={ classnames( {
						'nelio-content-automation-group--is-warning': true,
						'nelio-content-automation-group--is-expanded':
							isExpanded,
					} ) }
				></div>
			</Tooltip>
		);
	} //end if

	return null;
};

// =====
// HOOKS
// =====

const useActiveProfiles = ( groupId: AutomationGroupId ) =>
	useSelect( ( select ): ReadonlyArray< SocialProfile > => {
		const group = select( NC_AUTOMATION_SETTINGS ).getAutomationGroup(
			groupId
		);
		if ( ! group ) {
			return [];
		} //end if

		const selection = values( group.profileSettings )
			.filter( ( ps ) => ps.enabled )
			.map( ( ps ) => ps.profileId );

		return select( NC_DATA )
			.getSocialProfiles()
			.filter( ( p ) => selection.includes( p.id ) );
	} );

const useIsValidGroup = ( groupId: AutomationGroupId ) =>
	useSelect( ( select ) =>
		select( NC_AUTOMATION_SETTINGS ).isGroupValid( groupId )
	);

const useAreProfilesSelected = ( groupId: AutomationGroupId ) => {
	const group = useAutomationGroup( groupId );
	return !! values( group?.profileSettings ).filter( ( ps ) => ps.enabled )
		.length;
};
