export * from './date-time';
export * from './error';
export * from './media';
export * from './post';
export * from './profiles';
export * from './targets';
export * from './text';

import type { DateTimeAction } from './date-time';
import type { ErrorAction } from './error';
import type { MediaAction } from './media';
import type { PostAction } from './post';
import type { ProfileAction } from './profiles';
import type { TargetAction } from './targets';
import type { TextAction } from './text';

export type AttributeAction =
	| DateTimeAction
	| ErrorAction
	| MediaAction
	| PostAction
	| ProfileAction
	| TargetAction
	| TextAction;
