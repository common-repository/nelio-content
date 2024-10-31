/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_PROFILE_SETTINGS } from '../../store';
import { showErrorNotice } from '@nelio-content/utils';

export async function saveProfileSettings(): Promise< void > {
	const profileId = select( NC_PROFILE_SETTINGS ).getEditingProfileId();
	if ( ! profileId ) {
		return;
	} //end if

	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	const isSaving = select( NC_PROFILE_SETTINGS ).isSavingProfileSettings();
	if ( isSaving ) {
		return;
	} //end if

	const { markAsSavingProfileSettings } = dispatch( NC_PROFILE_SETTINGS );
	await markAsSavingProfileSettings( true );

	try {
		const settings =
			select( NC_PROFILE_SETTINGS ).getEditingProfileSettings();
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		await apiFetch( {
			url: `${ apiRoot }/site/${ siteId }/profile/${ profileId }`,
			method: 'PUT',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: settings,
		} );

		await dispatch( NC_DATA ).receiveSocialProfiles( {
			...profile,
			...settings,
		} );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await markAsSavingProfileSettings( false );
} //end saveProfileSettings()
