/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon, Tooltip } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { map, truncate } from 'lodash';
import {
	DeleteButton,
	ProfileCreator,
	SocialProfileIcon,
} from '@nelio-content/components';
import { store as NC_DATA, useSocialProfile } from '@nelio-content/data';
import { isDefined } from '@nelio-content/utils';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';

import { ReauthenticateAction } from './reauthenticate-action';

export type ProfileProps = {
	readonly profileId: Uuid;
};

export const Profile = ( { profileId }: ProfileProps ): JSX.Element | null => {
	const canReauthenticate = useCanRefreshProfile( profileId );

	const isBeingDeleted = useIsBeingDeleted( profileId );
	const isLocked = useIsLocked( profileId );

	const profile = useSocialProfile( profileId );
	const { deleteProfile, refreshProfile } =
		useDispatch( NC_PROFILE_SETTINGS );

	const { openProfileEditor } = useDispatch( NC_PROFILE_SETTINGS );

	const { isPublicationEnabled, isReshareEnabled } =
		useActualProfileFrequencies( profileId );

	if ( ! profile ) {
		return null;
	} //end if

	const { displayName, status } = profile;

	return (
		<div
			className={ classnames( {
				'nelio-content-profile': true,
				'nelio-content-profile--is-locked': isLocked,
				'nelio-content-profile--is-invalid': 'valid' !== status,
			} ) }
		>
			<div className="nelio-content-profile__name">
				{ displayName }
				{ isPublicationEnabled && (
					<Tooltip
						placement="bottom"
						text={ _x(
							'This profile can automatically share new content when it’s published',
							'text',
							'nelio-content'
						) }
						{ ...{ delay: 0 } }
					>
						<Dashicon
							className="nelio-content-profile__automation-icon"
							icon="megaphone"
						/>
					</Tooltip>
				) }
				{ isReshareEnabled && (
					<Tooltip
						text={ _x(
							'This profile might reshare old content daily',
							'text',
							'nelio-content'
						) }
						placement="bottom"
						{ ...{ delay: 0 } }
					>
						<Dashicon
							className="nelio-content-profile__automation-icon"
							icon="share-alt"
						/>
					</Tooltip>
				) }
			</div>
			<div className="nelio-content-profile__icon">
				<SocialProfileIcon profileId={ profileId } />
			</div>

			<div className="nelio-content-profile__details">
				{ !! profile.isBuffer && (
					<>
						<span>
							{ _x( 'Buffer Profile', 'text', 'nelio-content' ) }
						</span>
						<span>|</span>
					</>
				) }
				{ !! profile.isHootsuite && (
					<>
						<span>
							{ _x(
								'Hootsuite Profile',
								'text',
								'nelio-content'
							) }
						</span>
						<span>|</span>
					</>
				) }
				<ProfileCreator profileId={ profileId } />
				{ !! profile.email && (
					<>
						<span>|</span>
						<span>{ shortenEmail( profile.email ) }</span>
					</>
				) }
			</div>

			{ 'renew' === status && (
				<ReauthenticateAction
					isUserAllowed={ canReauthenticate }
					disabled={ isLocked }
					onClick={ () => void refreshProfile( profileId ) }
				/>
			) }

			{ isLocked ? (
				<div className="nelio-content-profile__feedback">
					{ isBeingDeleted ? (
						<DeleteButton
							isDeleting={ isBeingDeleted }
							onClick={ () => void null }
						/>
					) : (
						<br />
					) }
				</div>
			) : (
				<div className="nelio-content-profile__actions">
					{ 'renew' !== status && (
						<>
							<RefreshAction profileId={ profileId } />
							{ ' | ' }
							<Button
								variant="link"
								onClick={ () =>
									void openProfileEditor( profile.id, {
										email: profile.email ?? '',
										permalinkQueryArgs:
											profile.permalinkQueryArgs ?? [],
									} )
								}
							>
								{ _x( 'Settings', 'text', 'nelio-content' ) }
							</Button>
							{ ' | ' }
						</>
					) }
					<DeleteButton
						onClick={ () => void deleteProfile( profileId ) }
						confirmationLabels={ {
							title: _x(
								'Delete Social Profile and Templates',
								'text',
								'nelio-content'
							),
							text: _x(
								'Are you sure you want to delete this profile? If you do so, you’ll also delete any social templates you defined for this profile in the Automations tab. This operation cannot be undone.',
								'user',
								'nelio-content'
							),
						} }
					/>
				</div>
			) }
		</div>
	);
};

const RefreshAction = ( { profileId }: { profileId: Uuid } ) => {
	const canRefresh = useCanRefreshProfile( profileId );
	const { refreshProfile } = useDispatch( NC_PROFILE_SETTINGS );

	if ( ! canRefresh ) {
		return (
			<Tooltip
				placement="bottom"
				text={ _x(
					'Only the user who added this profile can refresh it',
					'user',
					'nelio-content'
				) }
				{ ...{ delay: 0 } }
			>
				<span>{ _x( 'Refresh', 'command', 'nelio-content' ) }</span>
			</Tooltip>
		);
	} //end if

	return (
		<Button
			variant="link"
			onClick={ () => void refreshProfile( profileId ) }
		>
			{ _x( 'Refresh', 'command', 'nelio-content' ) }
		</Button>
	);
};

// =====
// HOOKS
// =====

const useCanRefreshProfile = ( profileId: Uuid ): boolean =>
	useSelect( ( select ) => {
		const userId = select( NC_DATA ).getCurrentUserId();
		const profile = select( NC_DATA ).getSocialProfile( profileId );
		return profile?.creatorId === userId;
	} );

const useIsBeingDeleted = ( profileId: Uuid ) =>
	useSelect( ( select ) =>
		select( NC_PROFILE_SETTINGS ).isProfileBeingDeleted( profileId )
	);

const useIsLocked = ( profileId: Uuid ) =>
	useSelect( ( select ) =>
		select( NC_PROFILE_SETTINGS ).isProfileBeingDeleted( profileId )
	);

const useActualProfileFrequencies = ( profileId: Uuid ) =>
	useSelect( ( select ) => {
		const groups = map(
			select( NC_DATA ).getAutomationGroups(),
			select( NC_DATA ).getAutomationGroup
		)
			.filter( isDefined )
			.filter( ( g ) => !! g.priority )
			.filter( ( g ) => !! g.profileSettings[ profileId ]?.enabled );

		return {
			isPublicationEnabled: groups.some(
				( g ) => !! g.profileSettings[ profileId ]?.publication.enabled
			),
			isReshareEnabled: groups.some(
				( g ) => !! g.profileSettings[ profileId ]?.reshare.enabled
			),
		};
	} );

// =======
// HELPERS
// =======

const shortenEmail = ( email: string ) => {
	const [ name = '', domain = '' ] = email.split( '@' );
	const opts = { length: 10, omission: '…' };
	return `${ truncate( name, opts ) }@${ truncate( domain, opts ) }`;
};
