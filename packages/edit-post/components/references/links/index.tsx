/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { Link } from '../link';
import { store as NC_EDIT_POST } from '../../../store';

export const Links = (): JSX.Element => {
	const links = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getSuggestedReferences()
	);

	if ( isEmpty( links ) ) {
		return (
			<div>
				{ _x(
					'Do you have an interesting or helpful link for the author? Save it here!',
					'user',
					'nelio-content'
				) }
			</div>
		);
	} //end if

	return (
		<div>
			{ links.map( ( link ) => (
				<Link key={ link } link={ link } />
			) ) }
		</div>
	);
};
