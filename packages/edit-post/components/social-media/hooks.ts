/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { values } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { Post, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../store';

export const useHasUsableAutomationGroups = (): boolean =>
	useSelect( ( select ) => {
		const post = select( NC_EDIT_POST ).getPost();
		const groups = select( NC_DATA ).getPostAutomationGroups( post );
		return groups.some(
			( g ) =>
				!! g.priority &&
				values( g.profileSettings ).some(
					( ps ) =>
						ps.enabled &&
						( ps.publication.enabled || ps.reshare.enabled )
				)
		);
	} );

export const useCanUseAutomations = (): boolean =>
	useSelect( ( select ) => {
		const { getPost, isTimelineBusy } = select( NC_EDIT_POST );
		const { canCurrentUserUseAutomationsInPost } = select( NC_DATA );

		return (
			! isTimelineBusy() &&
			canCurrentUserUseAutomationsInPost( getPost() )
		);
	} );

export const useDeletingMessageIds = (): ReadonlyArray< Uuid > =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getDeletingMessageIds() );

export const usePost = (): Post =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getPost() );

export const useIsTimelineBusy = (): boolean =>
	useSelect( ( select ) => select( NC_EDIT_POST ).isTimelineBusy() );

export const useCanCreateMessages = (): boolean =>
	useSelect( ( select ) => {
		const post = select( NC_EDIT_POST ).getPost();
		const { isTimelineBusy } = select( NC_EDIT_POST );
		const { canCurrentUserCreateMessagesRelatedToPost } = select( NC_DATA );
		return (
			! isTimelineBusy() &&
			canCurrentUserCreateMessagesRelatedToPost( post )
		);
	} );

export const useCouldSubscriberCreateMessages = (): boolean =>
	useSelect( ( select ) => {
		const post = select( NC_EDIT_POST ).getPost();
		const { isTimelineBusy } = select( NC_EDIT_POST );
		const { couldSubscriberCreateMessagesRelatedToPost } =
			select( NC_DATA );
		return (
			! isTimelineBusy() &&
			couldSubscriberCreateMessagesRelatedToPost( post )
		);
	} );
