/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isUrl } from '@nelio-content/utils';
import type { Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export const EditImage = (): JSX.Element => {
	const [ imageUrl, setImageUrl ] = useImageUrl();
	const [ imageAlt, setImageAlt ] = useImageAlt();
	const { save, cancel } = useActions();

	const onKeyDown = ( ev?: unknown ) => {
		const fix = ( x: unknown ): x is KeyboardEvent => !! x;
		if ( ! fix( ev ) ) {
			return;
		} //end if

		if ( 'Enter' !== ev.key ) {
			return;
		} //end if

		ev.preventDefault();
		void save();
	};

	return (
		<div className="nelio-content-efi-edit-image">
			<TextControl
				label={ _x( 'Image URL', 'text', 'nelio-content' ) }
				placeholder="https://…"
				value={ imageUrl }
				onChange={ ( url ) => void setImageUrl( url as Url ) }
				onKeyDown={ onKeyDown }
			/>
			<TextControl
				label={ _x( 'Alt Text', 'text', 'nelio-content' ) }
				value={ imageAlt }
				onChange={ setImageAlt }
				onKeyDown={ onKeyDown }
			/>

			<div className="nelio-content-efi-edit-image__action">
				<Button variant="secondary" onClick={ cancel }>
					{ _x( 'Cancel', 'command', 'nelio-content' ) }
				</Button>{ ' ' }
				<Button
					variant="secondary"
					onClick={ save }
					disabled={ ! isUrl( imageUrl ) }
				>
					{ _x( 'Set Image', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useImageAlt = () => {
	const imageAlt = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getExternalFeaturedImageAltField()
	);
	const { setExternalFeaturedImageAltField } = useDispatch( NC_EDIT_POST );
	return [ imageAlt, setExternalFeaturedImageAltField ] as const;
};

const useImageUrl = () => {
	const imageUrl = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getExternalFeaturedImageUrlField()
	);
	const { setExternalFeaturedImageUrlField } = useDispatch( NC_EDIT_POST );
	return [ imageUrl, setExternalFeaturedImageUrlField ] as const;
};

const useActions = () => {
	const [ imageAlt ] = useImageAlt();
	const [ imageUrl ] = useImageUrl();
	const { cancelEditionOfExternalFeaturedImage, setExternalFeaturedImage } =
		useDispatch( NC_EDIT_POST );

	return {
		save: () =>
			isUrl( imageUrl )
				? setExternalFeaturedImage( imageUrl, imageAlt )
				: undefined,
		cancel: () => cancelEditionOfExternalFeaturedImage(),
	};
};
