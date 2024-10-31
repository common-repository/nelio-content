/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl, Modal } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { useEffect, useRef, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { isUrl } from '@nelio-content/utils';
import type { Maybe, Url } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useActiveSocialNetwork } from '../../../hooks';
import { store as NC_SOCIAL_EDITOR } from '../../../store';

export const AddImageByUrlDialog = (): JSX.Element => {
	const ref = useRef< HTMLImageElement >( null );
	const activeNetwork = useActiveSocialNetwork();
	const [ imageUrlCandidate, setImageUrlCandidate ] = useState( '' );
	const [ imageUrl, setImageUrl ] = useState< Maybe< Url > >( undefined );
	const { setImage, showImageUrlSelector } = useDispatch( NC_SOCIAL_EDITOR );

	useEffect( () => {
		if ( ! ref?.current ) {
			return;
		} //end if
		const onLoad = () =>
			ref.current?.src === imageUrlCandidate &&
			isUrl( imageUrlCandidate ) &&
			setImageUrl( imageUrlCandidate );
		ref.current.addEventListener( 'load', onLoad );
		return () => ref.current?.removeEventListener( 'load', onLoad );
	}, [ imageUrlCandidate ] );

	const onChange = ( value: string ) => {
		setImageUrlCandidate( trim( value ) );
		setImageUrl( undefined );
	};
	const back = () => showImageUrlSelector( false );

	return (
		<Modal
			className="nelio-content-social-message-image-url-dialog"
			title={ _x( 'Add Image', 'text', 'nelio-content' ) }
			onRequestClose={ back }
		>
			<div className="nelio-content-social-message-image-url-dialog__content">
				<TextControl
					value={ imageUrlCandidate }
					onChange={ onChange }
					placeholder="https://…"
				/>
				<img
					ref={ ref }
					alt={ _x( 'Image Preview', 'text', 'nelio-content' ) }
					src={ imageUrlCandidate }
					style={ { display: 'none' } }
				/>
				{ imageUrl && (
					<div
						className="nelio-content-social-message-image-url-dialog__image"
						style={ {
							backgroundImage: `url(${ imageUrl })`,
						} }
					></div>
				) }
			</div>
			<div className="nelio-content-social-message-image-url-dialog__actions">
				<Button variant="secondary" onClick={ back }>
					{ _x( 'Cancel', 'command', 'nelio-content' ) }
				</Button>
				<Button
					variant="primary"
					onClick={ () => {
						if ( imageUrl ) {
							void setImage( activeNetwork, undefined, imageUrl );
							void back();
						}
					} }
					disabled={ ! imageUrl }
				>
					{ _x( 'Add Image', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</Modal>
	);
};
