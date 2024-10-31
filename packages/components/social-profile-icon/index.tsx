/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { useSocialProfile } from '@nelio-content/data';
import { getFirstLatinizedLetter } from '@nelio-content/utils';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { SocialNetworkIcon } from '../social-network-icon';

export type SocialProfileIconProps = {
	readonly className?: string;
	readonly isNetworkHidden?: boolean;
	readonly profileId: Uuid;
};

export const SocialProfileIcon = ( {
	className = '',
	isNetworkHidden = false,
	profileId,
}: SocialProfileIconProps ): JSX.Element => {
	const profile = useSocialProfile( profileId );
	const {
		displayName = '',
		username = '',
		photo = '',
		network,
		kind,
	} = profile || {};

	return (
		<div className={ `nelio-content-social-profile-icon ${ className }` }>
			<div
				className={ classnames( {
					'nelio-content-social-profile-icon__profile-picture': true,
					[ `nelio-content-social-profile-icon__profile-picture--is-letter-${ getFirstLatinizedLetter(
						`${ displayName }${ username }`
					) }` ]: !! getFirstLatinizedLetter(
						`${ displayName }${ username }`
					),
				} ) }
			>
				<div
					className="nelio-content-social-profile-icon__actual-profile-picture"
					style={ {
						backgroundImage: photo ? `url(${ photo })` : '',
					} }
				></div>

				{ ! isNetworkHidden && !! network && (
					<SocialNetworkIcon
						className="nelio-content-social-profile-icon__network"
						network={ network }
						kind={ kind }
						mini={ true }
					/>
				) }
			</div>
		</div>
	);
};
