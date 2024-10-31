/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { ExternalLink } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	AuthorIcon,
	PostEngagementAnalytics,
	PostPageviewsAnalytics,
} from '@nelio-content/components';
import { useAuthor, usePost, store as NC_DATA } from '@nelio-content/data';
import { dateI18n, getSettings as getDateSettings } from '@nelio-content/date';
import type { PostId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { SocialQueue } from '../../social-queue';

export type PostProps = {
	readonly postId: PostId;
};

export const Post = ( { postId }: PostProps ): JSX.Element | null => {
	const post = usePost( postId );
	const author = useAuthor( post?.author );
	const isGAConnected = useSelect( ( select ) =>
		select( NC_DATA ).isGAConnected()
	);

	if ( ! post ) {
		return null;
	} //end if

	const { title, excerpt, permalink, date, imageSrc: image } = post;
	const authorName = author?.name ?? '';
	const authorId = post.author;

	return (
		<div
			className={ classnames( {
				'nelio-content-analytics-post': true,
				'nelio-content-analytics-post--has-no-pageviews':
					! isGAConnected,
			} ) }
		>
			<div className="nelio-content-analytics-post__post">
				<div className="nelio-content-analytics-post__title">
					<ExternalLink href={ permalink }>{ title }</ExternalLink>
				</div>

				<div className="nelio-content-analytics-post__excerpt">
					{ excerpt ? excerpt : <br /> }
				</div>

				<div className="nelio-content-analytics-post__image">
					<div
						className="nelio-content-analytics-post__actual-image"
						style={ {
							backgroundImage: image
								? `url(${ image })`
								: undefined,
						} }
					></div>
				</div>

				<div className="nelio-content-analytics-post__author">
					<AuthorIcon
						className="nelio-content-analytics-post__author-icon"
						authorId={ authorId }
					/>
					<span className="nelio-content-analytics-post__author-name">
						{ authorName ||
							_x( 'Unknown Author', 'text', 'nelio-content' ) }
					</span>
				</div>

				<div className="nelio-content-analytics-post__details">
					{ post.typeName || post.type }
					{ ' • ' }
					{ dateI18n( getDateSettings().formats.date, date || '' ) }
				</div>
			</div>

			<PostPageviewsAnalytics
				className="nelio-content-analytics-post__pageviews"
				postId={ postId }
			/>

			<PostEngagementAnalytics
				className="nelio-content-analytics-post__engagement"
				postId={ postId }
			/>

			<SocialQueue
				className="nelio-content-analytics-post__social-queue"
				postId={ postId }
			/>
		</div>
	);
};
