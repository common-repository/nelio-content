/**
 * External dependencies
 */
import type { TaskPreset, TaskTemplate } from '@nelio-content/types';

export type Action =
	| MarkAsSaving
	| ResetTaskPresets
	| CreateTaskPreset
	| RemoveTaskPreset
	| SetTaskPresetName
	| SetTaskTemplates
	| OpenTaskTemplateEditor
	| EditTaskTemplate
	| CloseTaskTemplateEditor;

export function markAsSaving( saving: boolean ): MarkAsSaving {
	return {
		type: 'MARK_AS_SAVING',
		saving,
	};
} //end markAsSaving()

export function resetTaskPresets(
	presets: ReadonlyArray< TaskPreset >
): ResetTaskPresets {
	return {
		type: 'RESET_TASK_PRESETS',
		presets,
	};
} //end resetTaskPresets()

export function createTaskPreset(): CreateTaskPreset {
	return {
		type: 'CREATE_TASK_PRESET',
	};
} //end createTaskPreset()

export function removeTaskPreset(
	presetId: TaskPreset[ 'id' ]
): RemoveTaskPreset {
	return {
		type: 'REMOVE_TASK_PRESET',
		presetId,
	};
} //end removeTaskPreset()

export function setTaskPresetName(
	presetId: TaskPreset[ 'id' ],
	name: string
): SetTaskPresetName {
	return {
		type: 'SET_TASK_PRESET_NAME',
		presetId,
		name,
	};
} //end setTaskPresetName()

export function setTaskTemplates(
	presetId: TaskPreset[ 'id' ],
	templates: ReadonlyArray< TaskTemplate >
): SetTaskTemplates {
	return {
		type: 'SET_TASK_TEMPLATES',
		presetId,
		templates,
	};
} //end setTaskTemplates()

export function openTaskTemplateEditor(
	presetId: TaskPreset[ 'id' ],
	task: TaskTemplate
): OpenTaskTemplateEditor {
	return {
		type: 'OPEN_TASK_TEMPLATE_EDITOR',
		presetId,
		task,
	};
} //end openTaskTemplateEditor()

export function editTaskTemplate(
	task: Partial< TaskTemplate >
): EditTaskTemplate {
	return {
		type: 'EDIT_TASK_TEMPLATE',
		task,
	};
} //end editTaskTemplate()

export function closeTaskTemplateEditor(): CloseTaskTemplateEditor {
	return {
		type: 'CLOSE_TASK_TEMPLATE_EDITOR',
	};
} //end closeTaskTemplateEditor()

// ============
// HELPER TYPES
// ============

type MarkAsSaving = {
	readonly type: 'MARK_AS_SAVING';
	readonly saving: boolean;
};

type ResetTaskPresets = {
	readonly type: 'RESET_TASK_PRESETS';
	readonly presets: ReadonlyArray< TaskPreset >;
};

type CreateTaskPreset = {
	readonly type: 'CREATE_TASK_PRESET';
};

type RemoveTaskPreset = {
	readonly type: 'REMOVE_TASK_PRESET';
	readonly presetId: TaskPreset[ 'id' ];
};

type SetTaskPresetName = {
	readonly type: 'SET_TASK_PRESET_NAME';
	readonly presetId: TaskPreset[ 'id' ];
	readonly name: string;
};

type SetTaskTemplates = {
	readonly type: 'SET_TASK_TEMPLATES';
	readonly presetId: TaskPreset[ 'id' ];
	readonly templates: ReadonlyArray< TaskTemplate >;
};

type OpenTaskTemplateEditor = {
	readonly type: 'OPEN_TASK_TEMPLATE_EDITOR';
	readonly presetId: TaskPreset[ 'id' ];
	readonly task: TaskTemplate;
};

type EditTaskTemplate = {
	readonly type: 'EDIT_TASK_TEMPLATE';
	readonly task: Partial< TaskTemplate >;
};

type CloseTaskTemplateEditor = {
	readonly type: 'CLOSE_TASK_TEMPLATE_EDITOR';
};
