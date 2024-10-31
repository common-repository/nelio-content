/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { TaskPresetLoader } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../store';

export const TaskPresets = (): JSX.Element => {
	const postId = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getPostId()
	);

	const doesPostHaveTasks = useSelect(
		( select ) =>
			!! select( NC_DATA ).getTaskIdsRelatedToPost( postId ).length
	);

	const state = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getTaskPresetLoaderState()
	);

	const selection = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getTaskPresetSelection()
	);

	const { instantiatePresets, openTaskPresetLoader, selectTaskPresets } =
		useDispatch( NC_EDIT_POST );

	return (
		<TaskPresetLoader
			state={ state }
			actions={ doesPostHaveTasks ? 'replace-or-merge' : 'add' }
			selection={ selection }
			onUpdate={ selectTaskPresets }
			onCancel={ () => openTaskPresetLoader( false ) }
			onMerge={ ( tasks ) => instantiatePresets( 'merge', tasks ) }
			onReplace={ ( tasks ) => instantiatePresets( 'replace', tasks ) }
		/>
	);
};
