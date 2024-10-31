/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Modal, TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { SaveButton } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty, isValidTwitterHandler } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export const EditFeedForm = (): JSX.Element | null => {
	const [ name, setName ] = useName();
	const [ twitter, setTwitter ] = useTwitter();
	const [ isSaving, save ] = useSave();

	const isOpen = useIsOpen();
	const isChanged = useIsDirty();

	const { closeEditor } = useDispatch( NC_FEEDS );
	const close = () => ! isSaving && closeEditor();

	if ( ! isOpen ) {
		return null;
	} //end if

	const error = getError( name, twitter );
	return (
		<Modal
			title={ _x( 'Edit Feed', 'text', 'nelio-content' ) }
			className="nelio-content-edit-feed-modal"
			isDismissible={ ! isSaving }
			shouldCloseOnEsc={ ! isSaving }
			shouldCloseOnClickOutside={ ! isSaving }
			onRequestClose={ close }
		>
			<TextControl
				required
				label={ _x( 'Title', 'text', 'nelio-content' ) }
				disabled={ isSaving }
				value={ name }
				onChange={ setName }
				placeholder={ _x( 'Name this feed…', 'user', 'nelio-content' ) }
			/>

			<TextControl
				label={ _x( 'X Handler', 'text', 'nelio-content' ) }
				disabled={ isSaving }
				value={ twitter }
				onChange={ setTwitter }
				placeholder={ _x( '@username', 'text', 'nelio-content' ) }
			/>

			<div className="nelio-content-edit-feed-modal__actions">
				<SaveButton
					variant="primary"
					isUpdate
					isSaving={ isSaving }
					disabled={ ! isChanged }
					error={ error }
					onClick={ save }
				/>
			</div>
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useName = () => {
	const value = useSelect( ( select ) =>
		select( NC_FEEDS ).getEditingFeedName()
	);
	const { setEditingFeedName } = useDispatch( NC_FEEDS );
	return [ value, setEditingFeedName ] as const;
};

const useTwitter = () => {
	const value = useSelect( ( select ) =>
		select( NC_FEEDS ).getEditingFeedTwitter()
	);
	const { setEditingFeedTwitter } = useDispatch( NC_FEEDS );
	return [ value, setEditingFeedTwitter ] as const;
};

const useSave = () => {
	const feedId = useEditingFeedId();
	const [ name ] = useName();
	const [ twitter ] = useTwitter();
	const isSaving = useSelect( ( select ) =>
		select( NC_FEEDS ).isSavingAFeed()
	);

	const { saveFeed } = useDispatch( NC_FEEDS );
	const save = async () =>
		feedId ? saveFeed( feedId, { name, twitter } ) : undefined;

	return [ isSaving, save ] as const;
};

const useIsOpen = () => !! useEditingFeedId();

const useIsDirty = () => {
	const [ name ] = useName();
	const [ twitter ] = useTwitter();

	const feedId = useEditingFeedId();
	const feed = useSelect( ( select ) => {
		const { getFeed } = select( NC_DATA );
		return feedId ? getFeed( feedId ) : undefined;
	} );
	const oldName = feed?.name || '';
	const oldTwitter = feed?.twitter || '';

	return name !== oldName || twitter !== oldTwitter;
};

const useEditingFeedId = () =>
	useSelect( ( select ) => select( NC_FEEDS ).getEditingFeedId() );

// =======
// HELPERS
// =======

function getError( name: string, twitter: string ) {
	if ( isEmpty( trim( name ) ) ) {
		return _x( 'Feed title is missing', 'text', 'nelio-content' );
	} //end if

	if ( ! isValidTwitterHandler( twitter ) ) {
		return _x( 'Invalid twitter handler', 'text', 'nelio-content' );
	} //end if

	return '';
} //end getError()
