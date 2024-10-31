/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Type as PostType } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/author', {
	icon: 'admin-users',
	settings: {
		useBadStatus: false,
	},
	attributes: ( select ) => {
		const { getAuthorId, getPostType } = select( NC_EDIT_POST );
		const { getAuthor } = select( NC_DATA );
		const author = getAuthor( getAuthorId() );
		const typeName = getPostType();
		const pt: Maybe< PostType > = typeName
			? select( CORE ).getEntityRecord( 'root', 'postType', typeName )
			: undefined;
		return {
			isEnabled: !! pt?.supports.author,
			isAdmin: !! author?.isAdmin,
		};
	},
	validate: ( { isEnabled, isAdmin }, { useBadStatus } ) => {
		if ( ! isEnabled ) {
			return { status: 'invisible', text: '' };
		} //end if

		if ( isAdmin ) {
			return {
				status: useBadStatus ? 'bad' : 'improvable',
				text: _x(
					'Select a non-admin author',
					'user',
					'nelio-content'
				),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'Valid author', 'text', 'nelio-content' ),
		};
	},
} );
