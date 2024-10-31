/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';
import type { Attachment } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import { isUrl } from '@nelio-content/utils';
import type { ImageId, Maybe, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToFeaturedImage( { setFeaturedImage }: Actions ): void {
	const { getExternalFeaturedImageUrl } = select( NC_EDIT_POST );
	const { getEditedPostAttribute } = select( EDITOR );
	const { getEntityRecord } = select( CORE );

	let prevImageId: ImageId | 0;
	let prevImageSrc: Url | false;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
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

		const imageId = getEditedPostAttribute( 'featured_media' ) as ImageId;
		const media: Maybe< Attachment > = imageId
			? getEntityRecord( 'root', 'media', imageId )
			: undefined;
		const url = media?.source_url;
		const imageSrc: Url | false = isUrl( url ) ? url : false;
		if ( prevImageId === imageId && prevImageSrc === imageSrc ) {
			return;
		} //end if

		prevImageId = imageId;
		prevImageSrc = imageSrc;

		void setFeaturedImage( imageId, imageSrc );
	} );
} //end listenToFeaturedImage()
