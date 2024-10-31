/**
 * External dependencies
 */
import { values } from 'lodash';
import type {
	ImageId,
	Maybe,
	SocialMessage,
	SocialNetworkName,
	Url,
	VideoId,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../types';

export function getTypeByNetwork(
	state: State
): State[ 'attributes' ][ 'typeByNetwork' ] {
	return state.attributes.typeByNetwork;
} //end getTypeByNetwork()

export function getMessageTypeInNetwork(
	state: State,
	network: SocialNetworkName
): SocialMessage[ 'type' ] {
	return state.attributes.typeByNetwork[ network ];
} //end getMessageTypeInNetwork()

export function getImageId( state: State ): Maybe< ImageId > {
	return (
		state.attributes.message.imageId ||
		state.attributes.relatedPost?.imageId ||
		undefined
	);
} //end getImageId()

export function getImageUrl( state: State ): Maybe< Url > {
	return (
		state.attributes.message.image ||
		state.attributes.relatedPost?.imageSrc ||
		state.attributes.relatedPost?.images[ 0 ]
	);
} //end getImageUrl()

export function getVideoId( state: State ): Maybe< VideoId > {
	return state.attributes.message.videoId;
} //end getVideoId()

export function getVideoUrl( state: State ): Maybe< Url > {
	return state.attributes.message.video;
} //end getVideoUrl()

export function hasExplicitImage( state: State ): boolean {
	return values( state.attributes.typeByNetwork ).includes( 'image' );
} //end hasExplicitImage()

export function hasExplicitVideo( state: State ): boolean {
	return values( state.attributes.typeByNetwork ).includes( 'video' );
} //end hasExplicitVideo()
