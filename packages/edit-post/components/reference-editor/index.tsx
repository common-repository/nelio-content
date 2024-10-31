/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	ExternalLink,
	Modal,
	TextControl,
} from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { isEmail } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { SaveButton } from '@nelio-content/components';
import { isEmpty, isValidTwitterHandler } from '@nelio-content/utils';
import type { EditorialReference } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../store';

export const ReferenceEditor = (): JSX.Element | null => {
	const [ attributes, setAttributes ] = useAttributes();

	const isVisible = useSelect( ( select ) =>
		select( NC_EDIT_POST ).isReferenceEditorVisible()
	);
	const isSaving = useSelect( ( select ) => {
		const { isReferenceSaving } = select( NC_EDIT_POST );
		return ! attributes?.url || isReferenceSaving( attributes.url );
	} );

	const { close, saveAndClose } = useActions();

	if ( ! isVisible || ! attributes ) {
		return null;
	} //end if

	const { title, author, email, twitter, url } = attributes;
	const error = isReferenceInvalid( attributes );
	return (
		<Modal
			className="nelio-content-reference-editor"
			title={ _x( 'Edit Reference', 'text', 'nelio-content' ) }
			isDismissible={ false }
			shouldCloseOnEsc={ false }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => void null }
		>
			<TextControl
				value={ title }
				onChange={ ( value ) => setAttributes( { title: value } ) }
				placeholder={ _x(
					'Enter the title…',
					'user',
					'nelio-content'
				) }
			/>

			<div className="nelio-content-reference-editor__url">
				<strong>URL:</strong>{ ' ' }
				<ExternalLink href={ url }>{ url }</ExternalLink>
			</div>

			<h3 className="nelio-content-reference-editor__section-title">
				{ _x( 'Author Information', 'text', 'nelio-content' ) }
			</h3>

			<TextControl
				label={ _x( 'Name', 'text', 'nelio-content' ) }
				value={ author }
				onChange={ ( value ) => setAttributes( { author: value } ) }
				placeholder={ _x(
					'First and Last Names',
					'text',
					'nelio-content'
				) }
			/>

			<TextControl
				label={ _x( 'Email', 'text', 'nelio-content' ) }
				value={ email }
				onChange={ ( value ) => setAttributes( { email: value } ) }
				placeholder={ _x(
					'author@example.com',
					'text',
					'nelio-content'
				) }
			/>

			<TextControl
				label={ _x( 'X', 'text', 'nelio-content' ) }
				value={ twitter }
				onChange={ ( value ) => setAttributes( { twitter: value } ) }
				placeholder={ _x( '@username', 'text', 'nelio-content' ) }
			/>

			<div className="nelio-content-reference-editor__actions">
				<Button
					variant="secondary"
					disabled={ isSaving }
					onClick={ close }
				>
					{ _x( 'Cancel', 'command', 'nelio-content' ) }
				</Button>

				<SaveButton
					variant="primary"
					error={ error }
					isSaving={ isSaving }
					onClick={ () => void saveAndClose() }
				/>
			</div>
		</Modal>
	);
};

// =====
// HOOKS
// =====

const useAttributes = () => {
	const attributes = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getEditingReference()
	);

	const { updateEditingReference } = useDispatch( NC_EDIT_POST );

	return [ attributes, updateEditingReference ] as const;
};

const useActions = () => {
	const { closeReferenceEditor, saveAndCloseEditingReference } =
		useDispatch( NC_EDIT_POST );
	return {
		close: closeReferenceEditor,
		saveAndClose: saveAndCloseEditingReference,
	};
};

// =======
// HELPERS
// =======

const isReferenceInvalid = ( { email, twitter }: EditorialReference ) => {
	if ( ! isEmpty( email ) && ! isEmail( email ) ) {
		return _x(
			'Please write a valid email address',
			'user',
			'nelio-content'
		);
	} //end if

	if ( ! isValidTwitterHandler( twitter ) ) {
		return _x(
			'Please write a valid twitter handle',
			'user',
			'nelio-content'
		);
	} //end if

	return '';
};
