/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export const NoImage = (): JSX.Element => {
	const { editExternalFeaturedImage } = useDispatch( NC_EDIT_POST );
	return (
		<div className="nelio-content-efi-no-image">
			<Button variant="link" onClick={ editExternalFeaturedImage }>
				{ _x(
					'Set external featured image',
					'command',
					'nelio-content'
				) }
			</Button>
		</div>
	);
};
