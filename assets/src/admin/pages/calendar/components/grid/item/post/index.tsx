/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { AuthorIcon } from '@nelio-content/components';
import { store as NC_POST_EDITOR } from '@nelio-content/post-quick-editor';
import type { LegacyRef } from 'react';
import {
	useItem,
	useItemHoverListeners,
	usePostStatus,
} from '@nelio-content/calendar';
import type { Maybe, Post as PostInstance, PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { PostContent } from './post-content';
import { PostDetails } from './post-details';

export type PostProps = {
	readonly className?: string;
	readonly itemId: PostId;
	readonly dragReference: LegacyRef< HTMLDivElement >;
	readonly isClickable: boolean;
};

export const Post = ( {
	className = '',
	itemId,
	dragReference,
	isClickable,
}: PostProps ): JSX.Element | null => {
	const post = useItem( 'post', itemId ) as Maybe< PostInstance >;

	const postStatus = usePostStatus( post?.type, post?.status );

	const { openPostEditor } = useDispatch( NC_POST_EDITOR );
	const onClick = () =>
		void ( !! post && isClickable && openPostEditor( post ) );
	const { onMouseEnter, onMouseLeave } = useItemHoverListeners(
		'post',
		itemId
	);

	if ( ! post ) {
		return null;
	} //end if

	const { author, date, status, title, type, typeName } = post;

	return (
		<div // eslint-disable-line
			role={ typeName }
			className={ `nelio-content-calendar-post nelio-content-calendar-post--is-${
				status ?? 'unknown'
			} ${ className }` }
			data-item-id={ itemId }
			style={ {
				backgroundColor: postStatus?.colors?.background,
				borderTopColor: postStatus?.colors?.main,
			} }
			onClick={ onClick }
			onMouseEnter={ onMouseEnter }
			onMouseLeave={ onMouseLeave }
			ref={ dragReference }
		>
			<AuthorIcon
				className="nelio-content-calendar-post__author-icon"
				authorId={ author }
			/>

			<PostContent
				className="nelio-content-calendar-post__content"
				date={ date || '' }
				status={ status }
				type={ type }
				title={ title }
			/>

			<PostDetails
				className="nelio-content-calendar-post__details"
				itemId={ itemId }
				type={ type }
				typeName={ typeName }
			/>
		</div>
	);
};
