export type TextAction = SetTextAction;

export function setText( text: string ): SetTextAction {
	return {
		type: 'SET_TEXT',
		text,
	};
} //end setText()

// ============
// HELPER TYPES
// ============

type SetTextAction = {
	readonly type: 'SET_TEXT';
	readonly text: string;
};
