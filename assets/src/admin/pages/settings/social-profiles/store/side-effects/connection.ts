/**
 * WordPress dependencies
 */
import { select, dispatch } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { getDefaultPublicationValue } from '@nelio-content/networks';
import type {
	Maybe,
	SocialKindName,
	SocialNetworkName,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_PROFILE_SETTINGS } from '../../store';

export async function openConnectionDialog<
	T1 extends 'buffer' | 'hootsuite' | SocialNetworkName,
	T2 extends T1 extends 'buffer' | 'hootsuite'
		? SocialNetworkName
		: SocialKindName,
>( network: T1, kind: T2 ): Promise< Maybe< OpenConnectionDialogAction > > {
	await nothing();

	const connectionDialog =
		select( NC_PROFILE_SETTINGS ).getConnectionDialog();
	if ( connectionDialog ) {
		return;
	} //end if

	const publicationFreq = getDefaultPublicationValue(
		'buffer' === network || 'hootsuite' === network
			? ( kind as SocialNetworkName )
			: network
	);
	const baseUrl = getConnectionUrl( network, kind );
	const url = addQueryArgs( baseUrl, { publicationFreq } );

	return openJSNativeDialog( url );
} //end openConnectionDialog()

export async function refreshProfile(
	profileId: Uuid
): Promise< Maybe< OpenConnectionDialogAction > > {
	await nothing();

	const connectionDialog =
		select( NC_PROFILE_SETTINGS ).getConnectionDialog();
	if ( connectionDialog ) {
		return;
	} //end if

	const profile = select( NC_DATA ).getSocialProfile( profileId );
	if ( ! profile ) {
		return;
	} //end if

	const { network, kind } = profile;
	const baseUrl =
		profile.isBuffer || profile.isHootsuite
			? getConnectionUrl(
					profile.isBuffer ? 'buffer' : 'hootsuite',
					network
			  )
			: getConnectionUrl( network, kind );
	const url = addQueryArgs( baseUrl, { socialProfileId: profileId } );

	return openJSNativeDialog( url );
} //end refreshProfile()

export async function closeConnectionDialogAndRefresh(): Promise< void > {
	await nothing();

	const connectionDialog =
		select( NC_PROFILE_SETTINGS ).getConnectionDialog();
	if ( ! connectionDialog ) {
		return;
	} //end if

	await dispatch( NC_PROFILE_SETTINGS ).closeConnectionDialog(
		connectionDialog
	);

	await dispatch( NC_PROFILE_SETTINGS ).refreshSocialProfiles();
} //end closeConnectionDialogAndRefresh()

export async function closeConnectionDialog(
	dialog: Window
): Promise< CloseConnectionDialogAction > {
	await nothing();

	if ( ! dialog.close ) {
		dialog.close();
	} //end if

	return {
		type: 'CLOSE_CONNECTION_DIALOG',
	};
} //end closeConnectionDialog()

function getConnectionUrl<
	T1 extends 'buffer' | 'hootsuite' | SocialNetworkName,
	T2 extends T1 extends 'buffer' | 'hootsuite'
		? SocialNetworkName
		: SocialKindName,
>( networkName: T1, kindName: T2 ): string {
	const siteId = select( NC_DATA ).getSiteId();
	const apiRoot = select( NC_DATA ).getApiRoot();
	const creatorId = select( NC_DATA ).getCurrentUserId();
	const lang = select( NC_DATA ).getSiteLanguage();

	if ( 'buffer' === networkName ) {
		return addQueryArgs( `${ apiRoot }/connect/buffer`, {
			network: kindName,
			siteId,
			creatorId,
			lang,
		} );
	} //end if

	if ( 'hootsuite' === networkName ) {
		return addQueryArgs( `${ apiRoot }/connect/hootsuite`, {
			network: kindName,
			siteId,
			creatorId,
			lang,
		} );
	} //end if

	const { network, kind } = getProperConnectionDetails(
		networkName,
		kindName as SocialKindName
	);
	const hasKind = kind && 'single' !== kind;
	const path = hasKind ? `${ network }/${ kind }` : network;
	const url = addQueryArgs( `${ apiRoot }/connect/${ path }`, {
		siteId,
		creatorId,
		lang,
	} );
	return url;
} //end getConnectionUrl()

const getProperConnectionDetails = (
	network: SocialNetworkName,
	kind: SocialKindName
) => {
	if ( network === 'instagram' ) {
		return { network: 'facebook', kind: 'instagram' };
	} //end if
	return { network, kind };
};

function openJSNativeDialog(
	url: string
): Maybe< OpenConnectionDialogAction > {
	const width = 640;
	const height = url.includes( 'telegram' ) ? 750 : 520;
	const dialog = window.open(
		url,
		'',
		`width=${ width },height=${ height }`
	);
	if ( ! dialog ) {
		return;
	} //end if

	const timer = setInterval( () => {
		if ( ! dialog.closed ) {
			return;
		} //end if
		clearInterval( timer );
		void dispatch( NC_PROFILE_SETTINGS ).closeConnectionDialogAndRefresh();
	}, 500 );

	return {
		type: 'OPEN_CONNECTION_DIALOG',
		dialog,
	};
} //end openJSNativeDialog()

function nothing(): Promise< void > {
	return new Promise( ( r ) => r() );
} //end nothing()

// ============
// HELPER TYPES
// ============

export type OpenConnectionDialogAction = {
	readonly type: 'OPEN_CONNECTION_DIALOG';
	readonly dialog: Window;
};

export type CloseConnectionDialogAction = {
	readonly type: 'CLOSE_CONNECTION_DIALOG';
};
