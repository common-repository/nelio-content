/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { uniq } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { PostTypeContext } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { useIsDisabled, useIsNew } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export type TypeSelectorProps = {
	readonly contexts: [ PostTypeContext, ...PostTypeContext[] ];
};

export const TypeSelector = ( {
	contexts,
}: TypeSelectorProps ): JSX.Element | null => {
	const [ postType, setPostType ] = usePostType();
	const options = usePostTypes( contexts );
	const disabled = useIsDisabled();
	const isNew = useIsNew();

	if ( ! isNew || options.length < 2 ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-post-quick-editor__type">
			<SelectControl
				disabled={ disabled }
				value={ postType }
				onChange={ setPostType }
				options={ options }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePostType = () => {
	const postType = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getPostType()
	);
	const { setPostType } = useDispatch( NC_POST_EDITOR );
	return [ postType, setPostType ] as const;
};

const usePostTypes = ( contexts: [ PostTypeContext, ...PostTypeContext[] ] ) =>
	useSelect( ( select ) => {
		const postTypes = contexts.flatMap( ( c ) =>
			select( NC_DATA ).getPostTypes( c, 'create' )
		);
		return uniq( postTypes ).map( ( { name, labels: { singular } } ) => ( {
			label: singular,
			value: name,
		} ) );
	} );
