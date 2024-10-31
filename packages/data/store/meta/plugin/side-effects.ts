/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, select } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { showErrorNotice } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function toggleSocialPublicationStatus(): Promise< void > {
	const isSocialPublicationPaused =
		select( NC_DATA ).isSocialPublicationPaused();
	try {
		await dispatch( NC_DATA ).markSocialPublicationStatusAsBeingSynched(
			true
		);
		const isSocialPublicationStillPaused = await apiFetch< boolean >( {
			path: '/nelio-content/v1/social/pause-publication',
			method: 'PUT',
			data: { paused: ! isSocialPublicationPaused },
		} );
		await dispatch( NC_DATA ).markSocialPublicationAsPaused(
			isSocialPublicationStillPaused
		);
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch
} //end toggleSocialPublicationStatus()

export async function installPremium(
	callback: (
		args:
			| {
					readonly success: true;
			  }
			| {
					readonly success: false;
					readonly message: string;
			  }
	) => void
): Promise< void > {
	try {
		await apiFetch( {
			path: 'nelio-content/v1/premium/install',
			method: 'POST',
		} );
		callback( { success: true } );
	} catch ( error ) {
		callback( {
			success: false,
			message: hasErrorMessage( error )
				? error.message
				: _x(
						'Unknown error installing Nelio Content Premium.',
						'text',
						'nelio-content'
				  ),
		} );
	}
} //end installPremium()

const hasErrorMessage = (
	x: unknown
): x is {
	readonly message: string;
} =>
	!! x &&
	'object' === typeof x &&
	'message' in x &&
	typeof x.message === 'string';
