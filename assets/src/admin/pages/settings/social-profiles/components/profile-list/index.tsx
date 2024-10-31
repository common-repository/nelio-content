/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { reverse, sortBy } from 'lodash';
import { useSocialProfiles } from '@nelio-content/data';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { Profile } from './profile';

export const ProfileList = (): JSX.Element => {
	const profiles = reverse( sortBy( useSocialProfiles(), 'creationDate' ) );

	if ( isEmpty( profiles ) ) {
		return (
			<p>
				{ _x(
					'Connect your social media profiles to Nelio Content using the following buttons:',
					'user',
					'nelio-content'
				) }
			</p>
		);
	} //end if

	return (
		<>
			<p>
				{ _x(
					'The following profiles can be managed by any author in your team:',
					'user',
					'nelio-content'
				) }
			</p>
			<div className="nelio-content-profile-list">
				{ profiles.map( ( { id } ) => (
					<Profile
						key={ `nelio-content-profile-${ id }` }
						profileId={ id }
					/>
				) ) }
			</div>
		</>
	);
};
