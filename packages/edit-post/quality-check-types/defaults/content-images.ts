/**
 * WordPress dependencies
 */
import { sprintf, _nx, _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/content-images', {
	icon: 'images-alt',
	settings: {
		improvableThreshold: 1,
		goodThreshold: 2,
	},
	attributes: ( select ) => {
		const { getImages } = select( NC_EDIT_POST );
		return {
			images: getImages(),
		};
	},
	validate: ( { images }, { improvableThreshold, goodThreshold } ) => {
		const numOfMissingImages = goodThreshold - images.length;

		if ( isEmpty( images ) ) {
			return {
				status:
					images.length < improvableThreshold ? 'bad' : 'improvable',
				text: sprintf(
					/* translators: number of images */
					_nx(
						'Add %d image in your copy',
						'Add %d images in your copy',
						numOfMissingImages,
						'user',
						'nelio-content'
					),
					numOfMissingImages
				),
			};
		} //end if

		if ( images.length < goodThreshold ) {
			return {
				status:
					images.length < improvableThreshold ? 'bad' : 'improvable',
				text: sprintf(
					/* translators: number of images */
					_nx(
						'Add %d more image in your copy',
						'Add %d more images in your copy',
						numOfMissingImages,
						'user',
						'nelio-content'
					),
					numOfMissingImages
				),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'Image count looks good', 'text', 'nelio-content' ),
		};
	},
} );
