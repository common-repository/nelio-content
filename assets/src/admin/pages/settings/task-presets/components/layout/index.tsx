/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	NoticeList,
	Popover,
	SlotFillProvider,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { StrictMode, useEffect } from '@safe-wordpress/element';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { PremiumDialog } from '@nelio-content/components';
import { withSubscriptionCheck } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { useArePresetsDirty } from '~/nelio-content-pages/settings/task-presets/hooks';

import { TaskPresetList } from '../task-preset-list';
import { TaskTemplateEditor } from '../task-template-editor';

export const Layout = (): JSX.Element => (
	<StrictMode>
		<SlotFillProvider>
			<InternalLayout />
			<PremiumDialog />
			<Popover.Slot />
		</SlotFillProvider>
	</StrictMode>
);

const InternalLayout = withSubscriptionCheck( 'raw/task-presets', () => {
	const { notices, removeNotice } = useNotices();
	const isDirty = useArePresetsDirty();

	useEffect( () => {
		if ( isDirty ) {
			window.addEventListener( 'beforeunload', onBeforeUnload, {
				capture: true,
			} );
		} else {
			window.removeEventListener( 'beforeunload', onBeforeUnload, {
				capture: true,
			} );
		} //end if
		return () => {
			window.removeEventListener( 'beforeunload', onBeforeUnload, {
				capture: true,
			} );
		};
	}, [ isDirty ] );

	return (
		<div className="nelio-content-task-presets-settings-layout">
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			<TaskPresetList />
			<TaskTemplateEditor />
		</div>
	);
} );

// =====
// HOOKS
// =====

const useNotices = () => {
	const notices = useSelect( ( select ) => select( NOTICES ).getNotices() );
	const { removeNotice } = useDispatch( NOTICES );
	return { notices, removeNotice };
};

// =======
// HELPERS
// =======

const onBeforeUnload = ( ev: BeforeUnloadEvent ) => {
	ev.preventDefault();
	return ( ev.returnValue = '' );
};
