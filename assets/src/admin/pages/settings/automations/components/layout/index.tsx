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
import { LoadingAnimation, PremiumDialog } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import {
	useAreGroupsDirty,
	useAutomationGroups,
} from '~/nelio-content-pages/settings/automations/hooks';
import { store as NC_AUTOMATION_SETTINGS } from '~/nelio-content-pages/settings/automations/store';

import { AutomationGroupList } from '../automation-group-list';
import { MessageCountEstimation } from '../message-count-estimation';
import { SocialTemplateEditor } from '../social-template-editor';
import { ImportExportTemplates } from '../import-export-templates';

export const Layout = (): JSX.Element => {
	const { isLoading: isLoadingGroups, data: groups } = useAutomationGroups();
	const { isLoading: isLoadingProfiles, data: profiles } =
		useSocialProfiles();
	const { initAutomationGroups } = useDispatch( NC_AUTOMATION_SETTINGS );
	const { notices, removeNotice } = useNotices();
	const isDirty = useAreGroupsDirty();

	const isLoading = isLoadingGroups || isLoadingProfiles;

	useEffect( () => {
		if ( isLoading ) {
			return;
		} //end if
		void initAutomationGroups( groups, profiles );
	}, [ isLoading ] );

	useEffect( () => {
		if ( isLoading ) {
			return;
		} //end if
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
	}, [ isDirty, isLoading ] );

	if ( isLoading ) {
		return (
			<div className="nelio-content-automations-settings-layout">
				<LoadingAnimation />
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-automations-settings-layout">
			<StrictMode>
				<SlotFillProvider>
					<NoticeList
						notices={ notices }
						className="components-editor-notices__pinned"
						onRemove={ removeNotice }
					/>
					<AutomationGroupList />
					<SocialTemplateEditor />
					<ImportExportTemplates />
					<MessageCountEstimation />
					<PremiumDialog />
					<Popover.Slot />
				</SlotFillProvider>
			</StrictMode>
		</div>
	);
};

// =====
// HOOKS
// =====

const useSocialProfiles = () =>
	useSelect( ( select ) => {
		const profiles = select( NC_DATA ).getSocialProfiles();
		const isLoading = select( NC_DATA ).isResolving( 'getSocialProfiles' );
		return { isLoading, data: profiles };
	} );

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
