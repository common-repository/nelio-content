/**
 * Internal dependencies
 */
import type { State as DialogsState } from './dialogs/config';
import type { State as EntitiesState } from './entities/config';
import type { State as ExternalCalendarsState } from './external-calendars/config';
import type { State as FiltersState } from './filters/config';
import type { State as InteractionState } from './interaction/config';
import type { State as SettingsState } from './settings/config';
import type { State as StatusState } from './status/config';

export type State = {
	readonly dialogs: DialogsState;
	readonly entities: EntitiesState;
	readonly externalCalendars: ExternalCalendarsState;
	readonly filters: FiltersState;
	readonly interaction: InteractionState;
	readonly settings: SettingsState;
	readonly status: StatusState;
};
