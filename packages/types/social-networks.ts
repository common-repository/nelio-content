/**
 * Internal dependencies
 */
import type { Maybe } from './utils';
import type { MediaItem } from './wordpress-entities';

export type SocialNetwork = {
	readonly id: SocialNetworkName;
	readonly automationFreqs: {
		readonly reshare: number;
		readonly publication: number;
	};
	readonly labels: {
		readonly add: string;
		readonly name: string;
		readonly settings: string;
	};
	readonly icon: JSX.Element;
	readonly limit: number;
	readonly supports: ReadonlyArray< SocialNetworkSupport >;
	readonly requires: OrArray< AndArray< SocialNetworkSupport > >;
	readonly validators?: {
		readonly image?: ( item: Maybe< MediaItem > ) => Maybe< ErrorDesc >;
		readonly video?: ( item: Maybe< MediaItem > ) => Maybe< ErrorDesc >;
	};
	readonly kinds?: ReadonlyArray< SocialKind >;
};

export type SocialKind = {
	readonly id: SocialKindName;
	readonly label: string;
};

export type SocialNetworkName =
	| 'bluesky'
	| 'facebook'
	| 'gmb'
	| 'instagram'
	| 'linkedin'
	| 'mastodon'
	| 'medium'
	| 'pinterest'
	| 'reddit'
	| 'telegram'
	| 'threads'
	| 'tiktok'
	| 'tumblr'
	| 'twitter';

export type SocialKindName =
	| 'single'
	| 'page' // Facebook
	| 'company' // LinkedIn
	| 'location' // GMB
	| 'subreddit'; // Reddit

export type SocialNetworkSupport =
	| 'automations'
	| 'buffer-connection'
	| 'hootsuite-connection'
	| 'image'
	| 'multi-target'
	| 'network-template'
	| 'preview'
	| 'profile-template'
	| 'recurrence'
	| 'related-post'
	| 'reusability'
	| 'text'
	| 'video';

export type AndArray< T > = ReadonlyArray< T >;

export type OrArray< T > = ReadonlyArray< T >;

// ============
// HELPER TYPES
// ============

type ErrorDesc = string;
