/**
 * Internal dependencies
 */
import type { State as PagesState } from './pages/config';
import type { State as PluginState } from './plugin/config';
import type { State as SiteState } from './site/config';
import type { State as UserState } from './user/config';

export type State = {
	readonly pages: PagesState;
	readonly plugin: PluginState;
	readonly site: SiteState;
	readonly user: UserState;
};
