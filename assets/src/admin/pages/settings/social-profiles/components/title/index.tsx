/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

export const Title = (): JSX.Element => {
	const { count, total } = useProfileCount();

	if ( ! count ) {
		return (
			<div className="nelio-content-profile-section-title">
				<h2>{ _x( 'Add Profiles', 'text', 'nelio-content' ) }</h2>
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-profile-section-title">
			<h2>{ _x( 'Connected Profiles', 'text', 'nelio-content' ) }</h2>
			{ !! total && (
				<span className="nelio-content-profile-section-title__profile-count">
					{ count }/{ total }
				</span>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useProfileCount = () =>
	useSelect( ( select ) => {
		const { getSocialProfileCount, getPluginLimits } = select( NC_DATA );
		const { maxProfiles } = getPluginLimits() || {};
		return {
			count: getSocialProfileCount(),
			total: maxProfiles === Number.POSITIVE_INFINITY ? 0 : maxProfiles,
		};
	} );
