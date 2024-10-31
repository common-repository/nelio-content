/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { useActiveNetwork, useAvailableProfiles } from '../../../hooks';
import { SocialProfile } from './profile';

export type ProfilesProps = {
	readonly disabled?: boolean;
};

export const Profiles = ( { disabled }: ProfilesProps ): JSX.Element => {
	const [ activeNetwork ] = useActiveNetwork();
	const availableProfiles = useAvailableProfiles();

	return (
		<>
			<p className="screen-reader-text">
				{ _x(
					'Select one or more profiles:',
					'text',
					'nelio-content'
				) }
			</p>
			<ul
				className={ classnames( {
					'nelio-content-multiple-profile-selector__profiles': true,
					'nelio-content-multiple-profile-selector__profiles--is-disabled':
						disabled,
				} ) }
			>
				{ availableProfiles
					.filter( ( profile ) => profile.network === activeNetwork )
					.map( ( profile ) => (
						<SocialProfile
							key={ profile.id }
							profileId={ profile.id }
							disabled={ disabled }
						/>
					) ) }
			</ul>
		</>
	);
};
