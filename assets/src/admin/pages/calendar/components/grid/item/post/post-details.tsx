/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { CAT } from '@nelio-content/utils';
import type { PostId, PostTypeName } from '@nelio-content/types';

export type PostDetailsProps = {
	readonly className?: string;
	readonly itemId: PostId;
	readonly type: PostTypeName;
	readonly typeName: string;
};

export const PostDetails = ( {
	className,
	itemId,
	type,
	typeName,
}: PostDetailsProps ): JSX.Element => {
	const categoryNames = useCategoryNames( itemId );

	if ( 'post' === type ) {
		return (
			<div className={ className }>
				<Dashicon icon="category" />
				{ ` ${ categoryNames }` }
			</div>
		);
	} //end if

	if ( 'page' === type ) {
		return (
			<div className={ className }>
				<Dashicon icon="admin-page" />
				{ ` ${ typeName }` }
			</div>
		);
	} //end if

	return (
		<div className={ className }>
			<Dashicon icon="sticky" />
			{ ` ${ typeName }` }
		</div>
	);
};

// =====
// HOOKS
// =====

const useCategoryNames = ( itemId: PostId ): string =>
	useSelect( ( select ): string =>
		map(
			select( NC_DATA ).getPost( itemId )?.taxonomies[ CAT ],
			'name'
		).join( ', ' )
	);
