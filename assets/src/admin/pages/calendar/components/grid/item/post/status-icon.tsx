/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';

/**
 * External dependencies
 */
import { usePostStatus } from '@nelio-content/calendar';
import type { PostStatusSlug, PostTypeName } from '@nelio-content/types';

export type StatusIconProps = {
	readonly className?: string;
	readonly postType: PostTypeName;
	readonly postStatus: PostStatusSlug;
};

export const StatusIcon = ( {
	className,
	postType,
	postStatus,
}: StatusIconProps ): JSX.Element | null => {
	const status = usePostStatus( postType, postStatus );

	if ( ! status?.icon ) {
		return null;
	} //end if

	return (
		<span className={ className } title={ status.name }>
			<Dashicon icon={ status.icon } />
		</span>
	);
};
