/**
 * Internal dependencies
 */
import type { Uuid, Url, Weekday } from './utils';
import type { SocialNetworkName } from './social-networks';
import type { SocialTargetName } from './social-profiles';
import type {
	AuthorId,
	ImageId,
	PostId,
	PostTypeName,
	VideoId,
} from './wordpress-entities';
import type { Brand } from 'ts-brand';

export type SocialMessage = {
	readonly id: Uuid;
	readonly auto?: 'publication' | 'timeline' | 'reshare';
	readonly dateType: DateType;
	readonly dateValue: string;
	readonly failureDescription?: string;
	readonly image?: Url;
	readonly imageId?: ImageId;
	readonly isFreePreview?: boolean;
	readonly network: SocialNetworkName;
	readonly postAuthor?: AuthorId;
	readonly postId?: PostId;
	readonly postPermalink?: Url;
	readonly postType?: PostTypeName;
	readonly profileId: Uuid;
	readonly recurrenceGroup?: Uuid;
	readonly recurrenceSettings?: RecurrenceSettings;
	readonly schedule?: string;
	readonly sent?: boolean;
	readonly status: 'draft' | 'schedule' | 'publish' | 'error';
	readonly source:
		| 'manual'
		| 'user-highlight'
		| 'auto-extracted-sentence'
		| 'reshare-template'
		| 'publication-template';
	readonly targetName?: SocialTargetName;
	readonly text: string;
	readonly textComputed: string;
	readonly timeType: TimeType;
	readonly timeValue: string;
	readonly type: 'text' | 'image' | 'auto-image' | 'video';
	readonly video?: Url;
	readonly videoId?: VideoId;
};

export type ReusableSocialMessage = Pick<
	SocialMessage,
	| 'image'
	| 'imageId'
	| 'network'
	| 'postAuthor'
	| 'postId'
	| 'postType'
	| 'profileId'
	| 'targetName'
	| 'text'
	| 'textComputed'
	| 'timeValue'
	| 'type'
	| 'video'
	| 'videoId'
> & {
	readonly id: ReusableSocialMessageId;
	readonly timeType: 'exact' | 'time-interval';
};

export type ReusableSocialMessageId = Brand<
	number,
	'ReusableSocialMessageId'
>;

export type NewSocialMessage = Omit<
	SocialMessage,
	'id' | 'network' | 'profileId'
>;

export type SavingSocialMessage = Omit<
	EditingSocialMessage,
	'id' | 'status'
> & {
	readonly baseDatetime: string;
	readonly schedule: string;
	readonly source: 'manual';
	readonly textComputed: string;
	readonly timezone: string;
	readonly postAuthor?: AuthorId;
	readonly postId?: PostId;
	readonly postType?: PostTypeName;
	readonly recurrenceSettings?: RecurrenceSettings;
	readonly recurrenceUpdateAll?: boolean;
};

export type EditingSocialMessage = Pick<
	SocialMessage,
	| 'dateType'
	| 'dateValue'
	| 'failureDescription'
	| 'image'
	| 'imageId'
	| 'isFreePreview'
	| 'status'
	| 'text'
	| 'timeType'
	| 'timeValue'
	| 'video'
	| 'videoId'
> & {
	readonly id?: Uuid;
};

export type TimelinePeriod = 'day' | 'week' | 'month' | 'other';

export type DateType =
	| 'predefined-offset'
	| 'negative-days'
	| 'positive-days'
	| 'exact';

export type TimeType =
	| 'predefined-offset'
	| 'positive-hours'
	| 'time-interval'
	| 'exact';

export type RecurrenceSettings =
	| DailyRecurrenceSettings
	| WeeklyRecurrenceSettings
	| MonthlyRecurrenceSettings;

export type DailyRecurrenceSettings = {
	readonly occurrences: number;
	readonly interval: number;
	readonly period: 'day';
};

export type WeeklyRecurrenceSettings = {
	readonly occurrences: number;
	readonly interval: number;
	readonly period: 'week';
	readonly firstWeekday: Weekday;
	readonly weekdays: ReadonlyArray< Weekday >;
	readonly isMessageDay: boolean;
};

export type MonthlyRecurrenceSettings = {
	readonly occurrences: number;
	readonly interval: number;
	readonly period: 'month';
	readonly day: 'monthday' | 'nth-weekday' | 'last-weekday';
};

export type RecurrenceContext = {
	readonly monthday: number;
	readonly weekday: Weekday;
	readonly weekindex: [ 1 | 2 | 3 | 4 | 5 ] | [ 4, 5 ];
};
