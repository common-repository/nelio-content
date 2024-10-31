/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { _x } from '@safe-wordpress/i18n';
import type { Type as PostType } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { isEmpty } from '@nelio-content/utils';
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/excerpt', {
	icon: 'text',
	settings: {
		useBadStatus: false,
	},
	attributes: ( select ) => {
		const { getExcerpt, getPostType } = select( NC_EDIT_POST );
		const typeName = getPostType();
		const type: Maybe< PostType > = typeName
			? select( CORE ).getEntityRecord( 'root', 'postType', typeName )
			: undefined;
		return {
			isEnabled: !! type?.supports.excerpt,
			excerpt: getExcerpt(),
		};
	},
	validate: ( { isEnabled, excerpt }, { useBadStatus } ) => {
		if ( ! isEnabled ) {
			return { status: 'invisible', text: '' };
		} //end if

		if ( isEmpty( trim( excerpt ) ) ) {
			return {
				status: useBadStatus ? 'bad' : 'improvable',
				text: _x( 'Write an excerpt', 'user', 'nelio-content' ),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'Excerpt looks good', 'text', 'nelio-content' ),
		};
	},
} );
