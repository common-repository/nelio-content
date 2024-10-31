/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import type { Dict, ImageId, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { isElementor, type Actions } from './types';

export function listenToFeaturedImage( { setFeaturedImage }: Actions ): void {
	const elementor = ( window as unknown as Dict ).elementor;
	if ( ! isElementor( elementor ) ) {
		return;
	} //end if

	let prevImageId: ImageId | 0;
	let prevImageSrc: Url | false;

	const { getExternalFeaturedImageUrl } = select( NC_EDIT_POST );

	elementor.settings.page.model.on(
		'change:post_featured_image',
		function ( model ) {
			const efi = getExternalFeaturedImageUrl();
			if ( efi ) {
				if ( prevImageId === 0 && prevImageSrc === efi ) {
					return;
				} //end if
				prevImageId = 0;
				prevImageSrc = efi || false;
				void setFeaturedImage( prevImageId, efi );
				return;
			} //end if

			const { url, id } = model.get(
				'post_featured_image'
			) as PostFeaturedImage;
			const imageSrc = url === '' ? false : url;
			const imageId = id === '' ? 0 : id;
			if ( prevImageId === imageId && prevImageSrc === imageSrc ) {
				return;
			} //end if
			prevImageId = imageId;
			prevImageSrc = imageSrc;

			void setFeaturedImage( imageId, imageSrc );
		}
	);
} //end listenToFeaturedImage()

type PostFeaturedImage = {
	readonly url: Url | '';
	readonly id: ImageId | '';
};
