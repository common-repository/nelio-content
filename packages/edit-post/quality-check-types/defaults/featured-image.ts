/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { _x } from '@safe-wordpress/i18n';
import type { Type as PostType } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/featured-image', {
	icon: 'format-image',
	settings: {
		useBadStatus: true,
		canImageBeAutoSet: false,
	},
	attributes: ( select ) => {
		const { getFeaturedImageSrc, getPostType } = select( NC_EDIT_POST );
		const typeName = getPostType();
		const type: Maybe< PostType > = typeName
			? select( CORE ).getEntityRecord( 'root', 'postType', typeName )
			: undefined;
		return {
			isEnabled: !! type?.supports.excerpt,
			imageSrc: getFeaturedImageSrc(),
		};
	},
	validate: (
		{ isEnabled, imageSrc },
		{ canImageBeAutoSet, useBadStatus }
	) => {
		if ( ! isEnabled ) {
			return { status: 'invisible', text: '' };
		} //end if

		const hasFeaturedImage = ! isEmpty( imageSrc );

		if ( ! canImageBeAutoSet && ! hasFeaturedImage ) {
			return {
				status: useBadStatus ? 'bad' : 'improvable',
				text: _x( 'Set a featured image', 'user', 'nelio-content' ),
			};
		} //end if

		return {
			status: 'good',
			text: hasFeaturedImage
				? _x( 'There’s a featured image', 'text', 'nelio-content' )
				: _x( 'Automatic featured image', 'text', 'nelio-content' ),
		};
	},
} );
