export type SynchingAction = MarkAsSavingAction;

export function markAsSaving( isSaving: boolean ): MarkAsSavingAction {
	return {
		type: 'MARK_AS_SAVING',
		isSaving,
	};
} //end markAsSaving()

// ============
// HELPER TYPES
// ============

type MarkAsSavingAction = {
	readonly type: 'MARK_AS_SAVING';
	readonly isSaving: boolean;
};
