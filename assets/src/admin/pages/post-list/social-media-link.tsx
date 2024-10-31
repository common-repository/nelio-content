/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { PostId } from '@nelio-content/types';

export type SocialMediaLinkProps = {
	readonly postId: PostId;
};

export const SocialMediaLink = ( {
	postId,
}: SocialMediaLinkProps ): JSX.Element => {
	const { setPageAttribute } = useDispatch( NC_DATA );
	return (
		<Button
			className="nelio-content-social-media-button"
			variant="link"
			onClick={ () =>
				setPageAttribute( 'post-list/social-media-details', postId )
			}
		>
			{ _x( 'Social Media', 'text', 'nelio-content' ) }
		</Button>
	);
};
