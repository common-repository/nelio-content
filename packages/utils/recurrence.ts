/**
 * External dependencies
 */
import type {
	Maybe,
	RecurrenceSettings,
	SocialMessage,
	Uuid,
} from '@nelio-content/types';

type RecurringMessage = SocialMessage & {
	readonly recurrenceGroup: Uuid;
	readonly recurrenceSettings: RecurrenceSettings;
};

export const isRecurringMessage = (
	m: Maybe< SocialMessage >
): m is RecurringMessage =>
	!! m && !! m.recurrenceGroup && !! m.recurrenceSettings;

export const isRecurringSource = ( m: RecurringMessage ): boolean =>
	m.id === m.recurrenceGroup;
