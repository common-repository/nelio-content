/**
 * External dependencies
 */
import type {
	Maybe,
	Post,
	PostId,
	SocialMessage,
	EditorialComment,
	EditorialTask,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { getSocialMessagesRelatedToPost } from '../messages/selectors';
import { getCommentsRelatedToPost } from '../comments/selectors';
import { getTasksRelatedToPost } from '../tasks/selectors';
import { getAllPremiumItemsRelatedToPost } from '../premium/selectors';
import type { State } from '../../config';

type PostRelatedItems = {
	readonly comment: ReadonlyArray< EditorialComment >;
	readonly social: ReadonlyArray< SocialMessage >;
	readonly task: ReadonlyArray< EditorialTask >;
} & ReturnType< typeof getAllPremiumItemsRelatedToPost >;

export function getPost( state: State, id?: PostId ): Maybe< Post > {
	return id ? state.entities.posts[ id ] : undefined;
} //end getPost()

export function getPostRelatedItems(
	state: State,
	id?: PostId
): PostRelatedItems {
	return {
		comment: getCommentsRelatedToPost( state, id ),
		social: getSocialMessagesRelatedToPost( state, id ),
		task: getTasksRelatedToPost( state, id ),
		...getAllPremiumItemsRelatedToPost( state, id ),
	};
} //end getPostRelatedItems()
