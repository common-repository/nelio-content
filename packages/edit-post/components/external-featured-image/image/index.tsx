/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export const Image = (): JSX.Element => {
	const alt = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getExternalFeaturedImageAlt()
	);
	const url = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getExternalFeaturedImageUrl()
	);

	const { editExternalFeaturedImage } = useDispatch( NC_EDIT_POST );
	const { removeExternalFeaturedImage } = useDispatch( NC_EDIT_POST );

	return (
		<div className="nelio-content-efi-image">
			<Button
				className="nelio-content-efi-image__image-button"
				onClick={ editExternalFeaturedImage }
			>
				<img
					className="nelio-content-efi-image__actual-image"
					src={ url }
					alt={ alt }
				/>
			</Button>

			<div className="nelio-content-efi-image__replace-button">
				<Button
					variant="secondary"
					onClick={ editExternalFeaturedImage }
				>
					{ _x( 'Replace Image', 'command', 'nelio-content' ) }
				</Button>
			</div>

			<div>
				<Button
					variant="link"
					isDestructive
					onClick={ removeExternalFeaturedImage }
				>
					{ _x(
						'Remove external featured image',
						'command',
						'nelio-content'
					) }
				</Button>
			</div>
		</div>
	);
};
