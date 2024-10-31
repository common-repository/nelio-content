export type ErrorAction = MakeEditableAction;

export function makeEditable(): MakeEditableAction {
	return {
		type: 'MAKE_EDITABLE',
	};
} //end makeEditable()

// ============
// HELPER TYPES
// ============

type MakeEditableAction = {
	readonly type: 'MAKE_EDITABLE';
};
