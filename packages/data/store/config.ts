/**
 * Internal dependencies
 */
import type { State as BoardState } from './board/config';
import type { State as CalendarState } from './calendar/config';
import type { State as EntitiesState } from './entities/config';
import type { State as MetaState } from './meta/config';
import type { State as SocialState } from './social/config';

export type State = {
	readonly board: BoardState;
	readonly calendar: CalendarState;
	readonly entities: EntitiesState;
	readonly meta: MetaState;
	readonly social: SocialState;
};
