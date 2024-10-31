/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useEffect } from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA, useSocialProfiles } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from './store';

import {
	AddImageByUrlDialog,
	ConnectProfileWarning,
	EditorDialog,
	ErrorDialog,
	PublishDialog,
	RecurrenceSettingsDialog,
	ReusableEditorDialog,
} from './components/dialogs';
import { useIsEditingRecurrenceSettings } from './hooks';

export * from './store';

export const SocialMessageEditor = (): JSX.Element | null => {
	const isEditorVisible = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isEditorVisible()
	);

	const profiles = useSocialProfiles();

	const isFreePreview = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isFreePreview()
	);

	const isImageUrlSelectorVisible = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isImageUrlSelectorVisible()
	);

	const status = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getStatus()
	);

	const isEditingReusableMessage = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isEditingReusableMessage()
	);

	const [ isEditingRecurrence ] = useIsEditingRecurrenceSettings();

	const { openPremiumDialog } = useDispatch( NC_DATA );
	const { close } = useDispatch( NC_SOCIAL_EDITOR );
	useEffect( () => {
		if ( ! isEditorVisible || ! isFreePreview ) {
			return;
		} //end if
		void close();
		void openPremiumDialog( 'raw/free-previews' );
	}, [ isEditorVisible, isFreePreview ] );

	if ( ! isEditorVisible ) {
		return null;
	} //end if

	if ( ! profiles.length ) {
		return <ConnectProfileWarning />;
	} //end if

	if ( 'error' === status ) {
		return <ErrorDialog />;
	} //end if

	if ( 'publish' === status ) {
		return <PublishDialog />;
	} //end if

	if ( isEditingRecurrence ) {
		return <RecurrenceSettingsDialog />;
	} //end if

	if ( isImageUrlSelectorVisible ) {
		return <AddImageByUrlDialog />;
	} //end if

	if ( isEditingReusableMessage ) {
		return <ReusableEditorDialog />;
	} //end if

	return <EditorDialog />;
};
