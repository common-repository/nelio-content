/**
 * External dependencies
 */
import type { Maybe, TaskPreset, TaskTemplate } from '@nelio-content/types';

export type State = {
	readonly saving: boolean;
	readonly taskPresets: {
		readonly byId: Record< TaskPreset[ 'id' ], TaskPreset >;
		readonly allIds: ReadonlyArray< TaskPreset[ 'id' ] >;
	};
	readonly editor: Maybe< TaskTemplateEditor >;
};

export type TaskTemplateEditor = {
	readonly presetId: TaskPreset[ 'id' ];
	readonly source: TaskTemplate;
	readonly attrs: TaskTemplate;
};
