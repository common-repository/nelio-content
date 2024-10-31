/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { useRef, useState, useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { Comment } from '../comment';
import { store as NC_EDIT_POST } from '../../../store';

export const Comments = (): JSX.Element => {
	const ref = useRef< HTMLDivElement >( null );
	const [ count, setCount ] = useState( -1 );
	const commentIds = useSelect( ( select ) =>
		select( NC_DATA ).getCommentIdsRelatedToPost(
			select( NC_EDIT_POST ).getPostId()
		)
	);
	const currentCount = commentIds.length;

	useEffect( () => {
		if ( count === currentCount ) {
			return;
		} //end if

		if ( count < currentCount ) {
			ref.current?.scrollTo( {
				top: 999_999,
				behavior: count === -1 ? undefined : 'smooth',
			} );
		} //end if

		setCount( currentCount );
	}, [ count, currentCount, setCount ] );

	return (
		<div ref={ ref } className="nelio-content-editorial-comment-list">
			{ commentIds.map( ( commentId ) => (
				<Comment key={ commentId } commentId={ commentId } />
			) ) }
		</div>
	);
};
