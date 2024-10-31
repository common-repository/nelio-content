/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import type { PostStatusSlug, PostTypeName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { StatusIcon } from './status-icon';

export type PostContentProps = {
	readonly className?: string;
	readonly type: PostTypeName;
	readonly date: string;
	readonly status: PostStatusSlug;
	readonly title: string;
};

export const PostContent = ( {
	className = '',
	type,
	date,
	status,
	title,
}: PostContentProps ): JSX.Element => {
	const time = useSelect(
		( select ) =>
			!! date && select( NC_CALENDAR ).formatCalendarTime( date )
	);
	return (
		<div className={ className }>
			<StatusIcon
				className="nelio-content-calendar-post__status-icon"
				postStatus={ status }
				postType={ type }
			/>{ ' ' }
			{ !! time && (
				<>
					<strong>{ time }</strong>{ ' ' }
				</>
			) }
			<span>{ title }</span>
		</div>
	);
};
