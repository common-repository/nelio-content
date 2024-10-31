/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { doesNetworkSupport } from '@nelio-content/networks';
import { isEmpty } from '@nelio-content/utils';
import type {
	Maybe,
	SocialNetworkName,
	SocialTargetName,
	Uuid,
} from '@nelio-content/types';

/**
 * External dependencies
 */

export type LocationProps = {
	readonly network: SocialNetworkName;
	readonly profileId: Uuid;
	readonly targetName: Maybe< SocialTargetName >;
};

export const Location = ( props: LocationProps ): JSX.Element => {
	const text = useLocation( props );
	return (
		<div className="nelio-content-social-message__location">{ text }</div>
	);
};

// =====
// HOOKS
// =====

const useLocation = ( props: LocationProps ) =>
	useSelect( ( select ) => {
		const { network, profileId, targetName } = props;
		const { getSocialProfile } = select( NC_DATA );

		const profile = getSocialProfile( profileId );
		const profileDisplayName =
			profile?.displayName || _x( 'Unknown', 'text', 'nelio-content' );
		if ( ! targetName || ! doesNetworkSupport( 'multi-target', network ) ) {
			return <strong>{ profileDisplayName }</strong>;
		} //end if

		const { getProfileTarget } = select( NC_DATA );
		const target = getProfileTarget( profileId, targetName );
		const targetDisplayName = target?.displayName ?? '';

		if ( isEmpty( targetDisplayName ) ) {
			return <strong>{ profileDisplayName }</strong>;
		} //end if

		return createInterpolateElement(
			sprintf(
				/* translators: 1 -> profile name, 2 -> target name */
				_x( '%1$s on %2$s', 'text', 'nelio-content' ),
				`<strong>${ profileDisplayName }</strong>`,
				`<em>${ targetDisplayName }</em>`
			),
			{ strong: <strong />, em: <em /> }
		);
	} );
