/**
 * External dependencies
 */
import type {
	AuthorId,
	Post as FullPost,
	EditorialTask as FullEditorialTask,
	Maybe,
	Uuid,
} from '@nelio-content/types';

export type State = {
	readonly attributes: EditorialTask;

	readonly status: {
		readonly context: EditorContext;
		readonly error: string;
		readonly isNewTask: boolean;
		readonly isSaving: boolean;
		readonly isVisible: boolean;
		readonly relatedPost: {
			readonly post?: Post;
			readonly status: RelatedPostStatus;
		};
		readonly source: EditorialTask;
		readonly onSave: Maybe< ( task: FullEditorialTask ) => void >;
	};
};

export type EditorialTask = Pick<
	FullEditorialTask,
	'task' | 'dateType' | 'dateValue' | 'color' | 'completed'
> & {
	readonly assigneeId?: AuthorId;
	readonly assignerId?: AuthorId;
	readonly id?: Uuid;
};

export type RelatedPostStatus =
	| 'none'
	| 'searcher'
	| 'loading'
	| 'error'
	| 'ready';

export type EditorContext = 'calendar' | 'post';

export type Post = Pick<
	FullPost,
	'id' | 'type' | 'author' | 'date' | 'status' | 'title' | 'viewLink'
>;
