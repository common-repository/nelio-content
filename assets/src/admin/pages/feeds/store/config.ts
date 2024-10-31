/**
 * Internal dependencies
 */
import type { State as FeedsState } from './feeds/config';
import type { State as SettingsState } from './settings/config';

export type State = {
	readonly feeds: FeedsState;
	readonly settings: SettingsState;
};
