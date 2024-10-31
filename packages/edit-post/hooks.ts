/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from './store';

export const usePanelToggling = (
	panelName: string
): [ boolean, () => void ] => {
	const isOpen = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isPanelOpen( panelName )
	);

	const { togglePanel } = useDispatch( NC_EDIT_POST );
	const toggle = () => togglePanel( panelName, ! isOpen );

	return [ isOpen, toggle ];
};

export const useDisabledProfiles = (): ReadonlyArray< Uuid > =>
	useSelect( ( select ) => {
		const { getPost } = select( NC_EDIT_POST );
		const { isSubscribed, getProfilesWithMessagesRelatedToPost } =
			select( NC_DATA );
		const post = getPost();
		return isSubscribed() || ! post?.id
			? []
			: getProfilesWithMessagesRelatedToPost( post.id );
	} );
