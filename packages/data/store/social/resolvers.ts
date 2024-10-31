/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { logError } from '@nelio-content/utils';
import type {
	AutomationGroup,
	Maybe,
	SocialProfile,
	SocialProfileTarget,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../store';

export async function getSocialProfiles(): Promise< void > {
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
		await dispatch( NC_DATA ).receiveSocialProfiles( profiles );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getSocialProfiles()

export async function getSocialProfileIds(): Promise< void > {
	await resolveSelect( NC_DATA ).getSocialProfiles();
} //end getSocialProfileIds()

export async function getAutomationGroups(): Promise< void > {
	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const automationGroups = await apiFetch<
			ReadonlyArray< AutomationGroup >
		>( {
			url: `${ apiRoot }/site/${ siteId }/automation-groups`,
			method: 'GET',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await dispatch( NC_DATA ).resetAutomationGroups( automationGroups );
	} catch ( e ) {
		logError( e );
	} //end catch
} //end getAutomationGroups()

export async function getTargetsInProfile( profileId?: Uuid ): Promise< void > {
	if ( ! profileId ) {
		return;
	} //end if

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();
		const targets = await apiFetch<
			Maybe< ReadonlyArray< SocialProfileTarget > >
		>( {
			url: `${ apiRoot }/site/${ siteId }/profile/${ profileId }/targets`,
			method: 'GET',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await dispatch( NC_DATA ).receiveProfileTargets(
			profileId,
			targets ?? []
		);
	} catch ( e ) {
		logError( e );
		await dispatch( NC_DATA ).receiveProfileTargets( profileId, [] );
	} //end if
} //end getTargetsInProfile()

export async function getProfileTarget( profileId: Uuid ): Promise< void > {
	await resolveSelect( NC_DATA ).getTargetsInProfile( profileId );
} //end getProfileTarget()
