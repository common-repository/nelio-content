/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { AuthorSearcher } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { useIsDisabled } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export const Author = (): JSX.Element | null => {
	const [ authorId, setAuthorId ] = useAuthorId();
	const isMultiAuthor = useIsMultiAuthor();
	const disabled = useIsDisabled();

	if ( ! isMultiAuthor ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-post-quick-editor__author">
			<AuthorSearcher
				value={ authorId }
				onChange={ ( id ) => void ( id && setAuthorId( id ) ) }
				placeholder={ _x( 'Author…', 'text', 'nelio-content' ) }
				disabled={ disabled }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAuthorId = () => {
	const authorId = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getAuthorId()
	);
	const { setAuthorId } = useDispatch( NC_POST_EDITOR );
	return [ authorId, setAuthorId ] as const;
};

const useIsMultiAuthor = () =>
	useSelect( ( select ) => select( NC_DATA ).isMultiAuthor() );
