/**
 * External dependencies
 */
import type { Brand } from 'ts-brand';

/**
 * Internal dependencies
 */
import type { Uuid } from './utils';

export type InternalEventType = Brand< string, 'InternalEventType' >;

export type InternalEvent = {
	readonly id: Uuid;
	readonly color?: string;
	readonly backgroundColor?: string;
	readonly date: string;
	readonly start?: string;
	readonly end?: string;
	readonly description: string;
	readonly editLink?: string;
	readonly isDayEvent: boolean;
	readonly title: string;
	readonly type: InternalEventType;
};
