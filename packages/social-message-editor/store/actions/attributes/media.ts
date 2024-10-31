/**
 * External dependencies
 */
import type {
	ImageId,
	Maybe,
	SocialNetworkName,
	Url,
	VideoId,
} from '@nelio-content/types';

export type MediaAction =
	| SwitchMessageTypeAction
	| SetImageAction
	| RemoveImageAction
	| SetVideoAction
	| RemoveVideoAction;

export function switchMessageType(
	network: SocialNetworkName,
	type: 'image' | 'video'
): SwitchMessageTypeAction {
	return {
		type: 'SWITCH_MESSAGE_TYPE',
		network,
		messageType: type,
	};
} //end setImage()

export function setImage(
	network: SocialNetworkName,
	imageId: Maybe< ImageId >,
	imageUrl: Url
): SetImageAction {
	return {
		type: 'SET_IMAGE',
		network,
		imageId,
		imageUrl,
	};
} //end setImage()

export function removeImage(): RemoveImageAction {
	return {
		type: 'REMOVE_IMAGE',
	};
} //end removeImage()

export function setVideo(
	network: SocialNetworkName,
	videoId: VideoId,
	videoUrl: Url
): SetVideoAction {
	return {
		type: 'SET_VIDEO',
		network,
		videoId,
		videoUrl,
	};
} //end setVideo()

export function removeVideo(): RemoveVideoAction {
	return {
		type: 'REMOVE_VIDEO',
	};
} //end removeVideo()

// ============
// HELPER TYPES
// ============

type SwitchMessageTypeAction = {
	readonly type: 'SWITCH_MESSAGE_TYPE';
	readonly network: SocialNetworkName;
	readonly messageType: 'image' | 'video';
};

type SetImageAction = {
	readonly type: 'SET_IMAGE';
	readonly network: SocialNetworkName;
	readonly imageId: Maybe< ImageId >;
	readonly imageUrl: Url;
};

type RemoveImageAction = {
	readonly type: 'REMOVE_IMAGE';
};

type SetVideoAction = {
	readonly type: 'SET_VIDEO';
	readonly network: SocialNetworkName;
	readonly videoId: VideoId;
	readonly videoUrl: Url;
};

type RemoveVideoAction = {
	readonly type: 'REMOVE_VIDEO';
};
