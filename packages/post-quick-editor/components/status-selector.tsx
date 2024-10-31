/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { SelectControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { filter, find, map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { hasHead, PUBLISHED } from '@nelio-content/utils';
import type { PostStatusSlug } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { useIsDisabled } from '../hooks';
import { store as NC_POST_EDITOR } from '../store';

export const StatusSelector = (): JSX.Element => {
	const [ status, setStatus ] = usePostStatus();
	const options = usePostStatuses();
	const disabled = useIsDisabled();
	const published = useIsAlreadyPublished();

	return (
		<div className="nelio-content-post-quick-editor__status">
			<SelectControl
				disabled={ disabled || published }
				value={ status }
				onChange={ setStatus }
				options={ options }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePostStatus = () => {
	const statuses = map( usePostStatuses(), 'value' );
	const status = useSelect( ( select ) =>
		select( NC_POST_EDITOR ).getPostStatus()
	);
	const { setPostStatus } = useDispatch( NC_POST_EDITOR );

	useEffect( () => {
		if ( ! hasHead( statuses ) ) {
			return;
		} //end if
		if ( ! status || ! statuses.includes( status ) ) {
			void setPostStatus( statuses[ 0 ] );
		} //end if
	}, [ statuses.join( ',' ), status ] );

	return [ status, setPostStatus ] as const;
};

const usePostStatuses = (): ReadonlyArray< {
	readonly value: PostStatusSlug;
	readonly label: string;
	readonly disabled?: boolean;
} > => {
	const published = useIsAlreadyPublished();
	const statuses = useSelect( ( select ) => {
		const { canCurrentUserPublishPost, getPost, getPostStatuses } =
			select( NC_DATA );
		const { getId, getPostType } = select( NC_POST_EDITOR );
		const postType = getPostType();
		const validStatuses = filter(
			postType ? getPostStatuses( postType ) : [],
			( { slug } ) => 'nelio-content-unscheduled' !== slug
		);
		const post = getPost( getId() );
		return map(
			validStatuses,
			( { slug, name, available, flags = [] } ) => ( {
				value: slug,
				label: name,
				disabled:
					! available ||
					flags.includes( 'disabled-in-editor' ) ||
					( slug === 'future' &&
						! canCurrentUserPublishPost( post ) ),
			} )
		);
	} );

	if ( published ) {
		return [
			find( statuses, { value: PUBLISHED } ) ?? {
				value: PUBLISHED,
				label: _x( 'Published', 'text', 'nelio-content' ),
				disabled: true,
			},
		];
	} //end if

	return filter(
		statuses,
		( { value } ) => value !== 'publish' && value !== 'trash'
	);
};

const useIsAlreadyPublished = () =>
	useSelect( ( select ) => {
		const { getPost } = select( NC_DATA );
		const { getId } = select( NC_POST_EDITOR );
		const post = getPost( getId() );
		return 'publish' === post?.status;
	} );
