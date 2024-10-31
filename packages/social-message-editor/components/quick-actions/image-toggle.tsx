/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Button,
	DropdownMenu,
	MenuGroup,
	MenuItem,
} from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { MediaUpload } from '@safe-wordpress/media-utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_DATA } from '@nelio-content/data';
import type { MediaUploadItem } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../store';
import {
	useActiveNetworkType,
	useActiveSocialNetwork,
	useDoesActiveNetworkSupport,
	useHasExplicitImage,
} from '../../hooks';

// NOTE. This is a workaround because, for some reason, clicking outside the dropdown doesn’t work if the click is still inside the modal window.
let doCloseMenu: () => void;
const closeMenuOnBlur = () => {
	if ( 'function' === typeof doCloseMenu ) {
		doCloseMenu();
	} //end if
};

export type ImageToggleProps = {
	readonly disabled?: boolean;
};

export const ImageToggle = ( {
	disabled,
}: ImageToggleProps ): JSX.Element | null => {
	const supportsImage = useDoesActiveNetworkSupport( 'image' );
	const type = useActiveNetworkType();
	const activeNetwork = useActiveSocialNetwork();
	const hasExplicitImage = useHasExplicitImage();
	const { setImage } = useDispatch( NC_SOCIAL_EDITOR );
	const { receiveMediaUploadItem } = useDispatch( NC_DATA );

	if ( ! supportsImage ) {
		return null;
	} //end if

	if ( 'image' === type ) {
		return <RemoveImage disabled={ disabled } />;
	} //end if

	if ( hasExplicitImage ) {
		return <UseExistingImage disabled={ disabled } />;
	} //end if

	return (
		<MediaUpload
			allowedTypes={ [ 'image' ] }
			onSelect={ ( image: MediaUploadItem ) => {
				void receiveMediaUploadItem( image );
				const { id, url } = image;
				void setImage( activeNetwork, id, url );
			} }
			render={ ( { open }: { open: () => void } ) => (
				<AddImage disabled={ disabled } onClick={ open } />
			) }
		/>
	);
};

// ============
// HELPER VIEWS
// ============

const RemoveImage = ( { disabled }: { disabled?: boolean } ): JSX.Element => {
	const { removeImage } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<Button
			className="nelio-content-social-message-editor__quick-action nelio-content-social-message-editor__quick-action--is-toggled"
			icon="format-image"
			label={ _x( 'Remove Image', 'command', 'nelio-content' ) }
			tooltipPosition="bottom center"
			isPressed
			disabled={ disabled }
			onClick={ removeImage }
		/>
	);
};

const AddImage = ( {
	disabled,
	onClick,
}: {
	disabled?: boolean;
	onClick: () => void;
} ) => {
	return (
		<DropdownMenu
			className={ classnames( {
				'nelio-content-social-message-editor__image-dropdown': true,
				'nelio-content-social-message-editor__quick-action': true,
			} ) }
			icon="format-image"
			label={ _x( 'Add Image…', 'command', 'nelio-content' ) }
			toggleProps={ { tooltipPosition: 'bottom center', disabled } }
			popoverProps={ {
				onClick: closeMenuOnBlur,
				onFocusOutside: closeMenuOnBlur,
			} }
		>
			{ ( { onClose }: { onClose: () => void } ) => {
				// NOTE. This is part of the workaround mentioned before.
				doCloseMenu = onClose;

				return (
					<MenuGroup>
						<AddImageFromMediaLibrary
							closeMenu={ onClose }
							openMediaLibrary={ onClick }
						/>
						<AddImageFromUrl closeMenu={ onClose } />
					</MenuGroup>
				);
			} }
		</DropdownMenu>
	);
};

const AddImageFromMediaLibrary = ( {
	openMediaLibrary,
	closeMenu,
}: {
	openMediaLibrary: () => void;
	closeMenu: () => void;
} ) => {
	return (
		<MenuItem
			role="menuitem"
			onClick={ () => {
				closeMenu();
				openMediaLibrary();
			} }
		>
			{ _x( 'Media Library', 'text', 'nelio-content' ) }
		</MenuItem>
	);
};

const AddImageFromUrl = ( { closeMenu }: { closeMenu: () => void } ) => {
	const { showImageUrlSelector } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<MenuItem
			role="menuitem"
			onClick={ () => {
				closeMenu();
				void showImageUrlSelector( true );
			} }
		>
			{ _x( 'URL', 'text', 'nelio-content' ) }
		</MenuItem>
	);
};

const UseExistingImage = ( { disabled }: { disabled?: boolean } ) => {
	const network = useActiveSocialNetwork();
	const { switchMessageType } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<Button
			className="nelio-content-social-message-editor__quick-action"
			icon="format-image"
			label={ _x( 'Use Image', 'command', 'nelio-content' ) }
			tooltipPosition="bottom center"
			disabled={ disabled }
			onClick={ () => switchMessageType( network, 'image' ) }
		/>
	);
};
