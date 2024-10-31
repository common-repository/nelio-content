/**
 * WordPress dependencies
 */
import { dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

import type {
	PostId,
	ReusableSocialMessage,
	SocialMessage,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../../store';
import type { SocialMessageEditorOptions } from '../../actions/status/ui';

export async function openSocialMessageEditor(
	message: SocialMessage | ReusableSocialMessage,
	options: SocialMessageEditorOptions
): Promise< void > {
	await dispatch( NC_SOCIAL_EDITOR ).openNewSocialMessageEditor(
		message,
		options
	);

	const { post } = options;
	if ( post ) {
		return;
	} //end if

	const { postId } = message;
	if ( ! postId ) {
		return;
	} //end if

	await loadRelatedPost( postId );
} //end openSocialMessageEditor()

export async function loadRelatedPost( postId: PostId ): Promise< void > {
	await dispatch( NC_SOCIAL_EDITOR ).setRelatedPostStatus( {
		type: 'loading',
		postId,
	} );
	const relatedPost = await resolveSelect( NC_DATA ).getPost( postId );
	if ( ! relatedPost ) {
		await dispatch( NC_SOCIAL_EDITOR ).setRelatedPostStatus( {
			type: 'error',
			postId,
		} );
		return;
	} //end if

	await dispatch( NC_SOCIAL_EDITOR ).setPost( relatedPost );
	await dispatch( NC_SOCIAL_EDITOR ).setRelatedPostStatus( {
		type: 'ready',
	} );
} //end loadRelatedPost()
