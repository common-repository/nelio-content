/**
 * Internal dependencies
 */
import type { Maybe, Uuid } from './utils';
import type { DateType } from './social-messages';
import type { AuthorId, PostId, PostTypeName } from './wordpress-entities';

export type EditorialTask = {
	readonly id: Uuid;
	readonly assigneeId: AuthorId;
	readonly assignerId: AuthorId;
	readonly color: Color;

	readonly completed: boolean;
	readonly dateDue: string;
	readonly dateType: DateType;
	readonly dateValue: string;
	readonly postAuthor?: AuthorId;
	readonly postId?: PostId;
	readonly postType?: PostTypeName;
	readonly task: string;
	readonly timezone: string;
};

export type TaskPreset = {
	readonly id: number;
	readonly name: string;
	readonly tasks: ReadonlyArray< TaskTemplate >;
};

export type TaskTemplate = {
	readonly assigneeId: Maybe< AuthorId >;
	readonly color: Color;
	readonly dateType: Exclude< DateType, 'exact' >;
	readonly dateValue: string;
	readonly task: string;
};

type Color =
	| 'none'
	| 'red'
	| 'orange'
	| 'yellow'
	| 'green'
	| 'cyan'
	| 'blue'
	| 'purple';
