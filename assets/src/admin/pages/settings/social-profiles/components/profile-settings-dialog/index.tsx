/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { isEmail } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { isEqual, trim } from 'lodash';
import { SaveButton } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';
import { EmailSetting } from './email-setting';
import { PermalinkParametersSetting } from './permalink-parameters-setting';

export const ProfileSettingsDialog = (): JSX.Element | null => {
	const error = useError();
	const status = useStatus();

	const { saveProfileSettings, closeProfileEditor: close } =
		useDispatch( NC_PROFILE_SETTINGS );

	const saveAndClose = () => void saveProfileSettings().then( close );

	if ( 'closed' === status ) {
		return null;
	} //end if

	return (
		<Modal
			className="nelio-content-profile-settings-dialog"
			title={ _x( 'Profile Settings', 'text', 'nelio-content' ) }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<EmailSetting />
			<PermalinkParametersSetting />

			<div className="nelio-content-profile-settings-dialog__actions">
				<Button
					variant="secondary"
					disabled={ 'saving' === status }
					onClick={ close }
				>
					{ status === 'open-dirty'
						? _x( 'Discard Changes', 'command', 'nelio-content' )
						: _x( 'Cancel', 'command', 'nelio-content' ) }
				</Button>

				<SaveButton
					error={ error || undefined }
					variant="primary"
					disabled={ 'open-clean' === status }
					isSaving={ 'saving' === status }
					onClick={ saveAndClose }
				/>
			</div>
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useError = () =>
	useSelect( ( select ): Maybe< string > => {
		const email = trim(
			select( NC_PROFILE_SETTINGS ).getEditingEmail()
		).replace( /^mailto:/i, '' );
		if ( !! email && ! isEmail( email ) ) {
			return _x(
				'Please write a valid email address',
				'user',
				'nelio-content'
			);
		} //end if

		return undefined;
	} );

const useStatus = () =>
	useSelect(
		( select ): 'open-clean' | 'open-dirty' | 'closed' | 'saving' => {
			select( NC_DATA );

			const profileId =
				select( NC_PROFILE_SETTINGS ).getEditingProfileId();
			if ( ! profileId ) {
				return 'closed';
			} //end if

			if ( select( NC_PROFILE_SETTINGS ).isSavingProfileSettings() ) {
				return 'saving';
			} //end if

			const editingProfile =
				select( NC_PROFILE_SETTINGS ).getEditingProfileSettings();

			const profile = select( NC_DATA ).getSocialProfile( profileId );
			const existingProfile: typeof editingProfile = {
				email: profile?.email ?? '',
				permalinkQueryArgs: profile?.permalinkQueryArgs ?? [],
			};

			const isDirty = ! isEqual( existingProfile, editingProfile );
			return isDirty ? 'open-dirty' : 'open-clean';
		}
	);
