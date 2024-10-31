/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, MediaItem, SocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { useActiveSocialNetwork } from './networks';
import { store as NC_SOCIAL_EDITOR } from '../store';
import type { State } from '../store/types';

export const useActiveNetworkType = (): SocialMessage[ 'type' ] => {
	const network = useActiveSocialNetwork();
	return useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getMessageTypeInNetwork( network )
	);
};

export const useTypeByNetwork = (): State[ 'attributes' ][ 'typeByNetwork' ] =>
	useSelect( ( select ) => select( NC_SOCIAL_EDITOR ).getTypeByNetwork() );

export const useHasExplicitImage = (): boolean =>
	useSelect( ( select ) => select( NC_SOCIAL_EDITOR ).hasExplicitImage() );

export const useHasExplicitVideo = (): boolean =>
	useSelect( ( select ) => select( NC_SOCIAL_EDITOR ).hasExplicitVideo() );

export const useMediaImage = (): Maybe< MediaItem > =>
	useSelect( ( select ) => {
		const id = select( NC_SOCIAL_EDITOR ).getImageId();
		return select( NC_DATA ).getMedia( id );
	} );

export const useMediaVideo = (): Maybe< MediaItem > =>
	useSelect( ( select ) => {
		const id = select( NC_SOCIAL_EDITOR ).getVideoId();
		return select( NC_DATA ).getMedia( id );
	} );
