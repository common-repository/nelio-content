/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { MediaUpload } from '@safe-wordpress/media-utils';

/**
 * External dependencies
 */
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
	useHasExplicitVideo,
} from '../../hooks';

export type VideoToggleProps = {
	readonly disabled?: boolean;
};

export const VideoToggle = ( {
	disabled,
}: VideoToggleProps ): JSX.Element | null => {
	const supportsVideo = useDoesActiveNetworkSupport( 'video' );
	const type = useActiveNetworkType();
	const activeNetwork = useActiveSocialNetwork();
	const hasExplicitVideo = useHasExplicitVideo();
	const { setVideo } = useDispatch( NC_SOCIAL_EDITOR );
	const { receiveMediaUploadItem } = useDispatch( NC_DATA );

	if ( ! supportsVideo ) {
		return null;
	} //end if

	if ( 'video' === type ) {
		return <RemoveVideo disabled={ disabled } />;
	} //end if

	if ( hasExplicitVideo ) {
		return <UseExistingVideo disabled={ disabled } />;
	} //end if

	return (
		<MediaUpload
			allowedTypes={ [ 'video' ] }
			onSelect={ ( video: MediaUploadItem ) => {
				void receiveMediaUploadItem( video );
				const { id, url } = video;
				void setVideo( activeNetwork, id, url );
			} }
			render={ ( { open }: { open: () => void } ) => (
				<AddVideo disabled={ disabled } onClick={ open } />
			) }
		/>
	);
};

// ============
// HELPER VIEWS
// ============

const RemoveVideo = ( { disabled }: { disabled?: boolean } ): JSX.Element => {
	const { removeVideo } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<Button
			className="nelio-content-social-message-editor__quick-action nelio-content-social-message-editor__quick-action--is-toggled"
			icon="video-alt2"
			label={ _x( 'Remove Video', 'command', 'nelio-content' ) }
			tooltipPosition="bottom center"
			isPressed
			disabled={ disabled }
			onClick={ removeVideo }
		/>
	);
};

const AddVideo = ( {
	label,
	disabled,
	onClick,
}: {
	label?: string;
	disabled?: boolean;
	onClick: () => void;
} ) => {
	return (
		<Button
			className="nelio-content-social-message-editor__quick-action"
			icon="video-alt2"
			label={ label ?? _x( 'Add Video…', 'command', 'nelio-content' ) }
			tooltipPosition="bottom center"
			disabled={ disabled }
			onClick={ onClick }
		/>
	);
};

const UseExistingVideo = ( { disabled }: { disabled?: boolean } ) => {
	const network = useActiveSocialNetwork();
	const { switchMessageType } = useDispatch( NC_SOCIAL_EDITOR );
	return (
		<Button
			className="nelio-content-social-message-editor__quick-action"
			icon="video-alt2"
			label={ _x( 'Use Video', 'command', 'nelio-content' ) }
			tooltipPosition="bottom center"
			disabled={ disabled }
			onClick={ () => switchMessageType( network, 'video' ) }
		/>
	);
};
