/**
 * Internal dependencies
 */
import type { Url, Uuid } from './utils';

export type ExternalCalendar = {
	readonly url: Url;
	readonly name: string;
};

export type ExternalEvent = {
	readonly id: Uuid;
	readonly calendar: Url;
	readonly date: string;
	readonly description: string;
	readonly isDayEvent: boolean;
	readonly title: string;
};
