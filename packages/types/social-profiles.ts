/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { SocialKindName, SocialNetworkName } from './social-networks';
import type {
	OverwriteableQueryArg,
	RegularQueryArg,
	Url,
	Uuid,
} from './utils';
import type { AuthorId } from './wordpress-entities';

export type SocialProfile = {
	readonly id: Uuid;
	readonly creationDate: string;
	readonly creatorId: AuthorId;
	readonly displayName: string;
	readonly email?: string;
	readonly isBuffer?: boolean;
	readonly isHootsuite?: boolean;
	readonly kind: SocialKindName;
	readonly network: SocialNetworkName;
	readonly publicationFrequency: number;
	readonly photo: Url;
	readonly permalinkQueryArgs: ReadonlyArray<
		RegularQueryArg | OverwriteableQueryArg
	>;
	readonly reshareFrequency: number;
	readonly status: 'valid' | 'renew';
	readonly username: string;
};

export type SocialTargetName = Brand< string, 'SocialTargetName' >;

export type SocialProfileTarget = {
	readonly name: SocialTargetName;
	readonly displayName: string;
	readonly image: Url;
};
