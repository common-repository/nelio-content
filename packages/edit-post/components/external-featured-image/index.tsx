/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { NoImage } from './no-image';
import { EditImage } from './edit-image';
import { Image } from './image';
import { store as NC_EDIT_POST } from '../../store';

export const ExternalFeaturedImage = (): JSX.Element | null => {
	const view = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getExternalFeaturedImageView()
	);

	switch ( view ) {
		case 'no-image':
			return <NoImage />;

		case 'edit-image':
			return <EditImage />;

		case 'image':
			return <Image />;

		default:
			return null;
	} //end switch
};
