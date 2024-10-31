/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useCanEditPost } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export const EditWarning = (): JSX.Element | null => {
	const canEditPost = useCanEditPost();
	const message = useWarningMessage();

	if ( canEditPost ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-post-quick-editor__edit-warning">
			<Dashicon icon="warning" />
			{ message }
		</div>
	);
};

// =====
// HOOKS
// =====

const useWarningMessage = () =>
	useSelect( ( select ) => {
		const { getPostType } = select( NC_POST_EDITOR );
		switch ( getPostType() ) {
			case 'page':
				return _x(
					'You’re not allowed to edit this page.',
					'user',
					'nelio-content'
				);

			case 'post':
				return _x(
					'You’re not allowed to edit this post.',
					'user',
					'nelio-content'
				);

			default:
				return _x(
					'You’re not allowed to edit this content.',
					'user',
					'nelio-content'
				);
		} //end switch
	} );
