/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty, showErrorNotice } from '@nelio-content/utils';
import type { SocialProfile, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_PROFILE_SETTINGS } from '../../store';

export async function deleteProfile( profileId: Uuid ): Promise< void > {
	try {
		await dispatch( NC_PROFILE_SETTINGS ).markAsBeingDeleted( profileId );

		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		await apiFetch( {
			url: `${ apiRoot }/site/${ siteId }/profile/${ profileId }`,
			method: 'DELETE',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await dispatch( NC_DATA ).removeSocialProfile( profileId );

		const profiles = select( NC_DATA ).getSocialProfiles();
		await apiFetch( {
			path: '/nelio-content/v1/settings/update-profiles',
			method: 'PUT',
			data: { profiles: ! isEmpty( profiles ) },
		} );

		await dispatch( NC_PROFILE_SETTINGS ).markAsDeleted( profileId );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end deleteProfile()

export async function refreshSocialProfiles(): Promise< void > {
	await dispatch( NC_PROFILE_SETTINGS ).markAsRefreshtingProfiles( true );

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const profiles = await apiFetch< ReadonlyArray< SocialProfile > >( {
			url: `${ apiRoot }/site/${ siteId }/profiles`,
			method: 'GET',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await apiFetch( {
			path: '/nelio-content/v1/settings/update-profiles',
			method: 'PUT',
			data: { profiles: ! isEmpty( profiles ) },
		} );

		await dispatch( NC_DATA ).receiveSocialProfiles( profiles );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_PROFILE_SETTINGS ).markAsRefreshtingProfiles( false );
} //end refreshSocialProfiles()
