/**
 * WordPress dependencies
 */
import { store as CORE } from '@safe-wordpress/core-data';
import { select, subscribe } from '@safe-wordpress/data';
import type { Attachment } from '@safe-wordpress/core-data';

/**
 * External dependencies
 */
import { debounce } from 'lodash';
import { store as NC_EDIT_POST } from '@nelio-content/edit-post';
import { seemsMediaId, isUrl } from '@nelio-content/utils';
import type { ImageId, Maybe, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToFeaturedImage( { setFeaturedImage }: Actions ): void {
	const { getEntityRecord } = select( CORE );
	const { getExternalFeaturedImageUrl } = select( NC_EDIT_POST );

	let prevImageId: ImageId | 0 = 0;
	let prevImageSrc: Url | false = false;

	const updateFeaturedImage = debounce( () => {
		const efi = getExternalFeaturedImageUrl();
		if ( efi ) {
			if ( prevImageId === 0 && prevImageSrc === efi ) {
				return;
			} //end if
			prevImageId = 0;
			prevImageSrc = efi;
			void setFeaturedImage( prevImageId, efi );
			return;
		} //end if

		const imageField = document.getElementById(
			'_thumbnail_id'
		) as HTMLInputElement;
		const val = Number.parseInt( imageField?.value || '' );
		const imageId: ImageId | 0 = seemsMediaId( val ) ? val : 0;
		const media: Maybe< Attachment > = imageId
			? getEntityRecord( 'root', 'media', imageId )
			: undefined;
		const url = media?.source_url;
		const imageSrc = isUrl( url ) ? url : false;

		if ( prevImageId === imageId && prevImageSrc === imageSrc ) {
			return;
		} //end if
		prevImageId = imageId;
		prevImageSrc = imageSrc;

		void setFeaturedImage( imageId, imageSrc );
	}, 500 );

	const listenToRegularFeaturedImage = () => {
		const postImageDiv = document.getElementById( 'postimagediv' );
		if ( ! postImageDiv ) {
			return;
		} //end if

		// Listen for a change in Image Id and listen to the store to resolve getMedia
		const observer = new MutationObserver( updateFeaturedImage );
		observer.observe( postImageDiv, { childList: true, subtree: true } );
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		subscribe( updateFeaturedImage );
	};

	const listenToExternalFeaturedImage = () => {
		let prevEfi: Maybe< Url >;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		subscribe( () => {
			const efi = getExternalFeaturedImageUrl();
			if ( efi === prevEfi ) {
				return;
			} //end if
			prevEfi = efi;
			updateFeaturedImage();
		} );
	};

	listenToRegularFeaturedImage();
	listenToExternalFeaturedImage();
} //end listenToFeaturedImage()
