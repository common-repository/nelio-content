/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { useIsDisabled } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export const PostTitle = (): JSX.Element => {
	const [ title, setTitle ] = useTitle();
	const disabled = useIsDisabled();

	return (
		<div className="nelio-content-post-quick-editor__title">
			<TextControl
				disabled={ disabled }
				value={ title }
				onChange={ ( value ) => setTitle( value ) }
				placeholder={ _x( 'Title…', 'text', 'nelio-content' ) }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useTitle = () => {
	const title = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getTitle()
	);
	const { setTitle } = useDispatch( NC_POST_EDITOR );
	return [ title, setTitle ] as const;
};
