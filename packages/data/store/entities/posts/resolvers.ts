/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { select, dispatch, resolveSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { logError } from '@nelio-content/utils';
import type {
	EditorialComment,
	EditorialTask,
	Post,
	PostId,
	SocialMessage,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

export async function getPost( postId?: PostId ): Promise< void > {
	if ( ! postId ) {
		return;
	} //end if

	const maybePost = select( NC_DATA ).getPost( postId );
	if ( !! maybePost ) {
		return;
	} //end if

	try {
		const post = await apiFetch< Post >( {
			path: `/nelio-content/v1/post/${ postId }`,
		} );
		await dispatch( NC_DATA ).receivePosts( post );
	} catch ( _ ) {
		logError( `Unable to retrieve post #${ postId }.` );
	} //end catch
} //end getPost()

export async function getPostRelatedItems( postId?: PostId ): Promise< void > {
	if ( ! postId ) {
		return;
	} //end if

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		type RelatedItems = {
			readonly social: ReadonlyArray< SocialMessage >;
			readonly tasks: ReadonlyArray< EditorialTask >;
			readonly comments: ReadonlyArray< EditorialComment >;
		};

		const relatedItems = await apiFetch< RelatedItems >( {
			url: `${ apiRoot }/site/${ siteId }/post/${ postId }/items`,
			method: 'GET',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await resolveSelect( NC_DATA ).getAllPremiumItemsRelatedToPost(
			postId
		);

		await dispatch( NC_DATA ).receiveSocialMessages( relatedItems.social );
		await dispatch( NC_DATA ).receiveTasks( relatedItems.tasks );
		await dispatch( NC_DATA ).receiveComments( relatedItems.comments );
	} catch ( _ ) {
		logError( `Unable to retrieve post #${ postId }’s related items.` );
	} //end catch
} //end getPostRelatedItems()
