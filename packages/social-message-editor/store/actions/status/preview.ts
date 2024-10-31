/**
 * External dependencies
 */
import { setValue } from '@nelio-content/utils';

export type PreviewAction = ShowPreviewAction;

export function showPreview( isVisible: boolean ): ShowPreviewAction {
	setValue( 'isSocialMessagePreviewVisible', isVisible );
	return {
		type: 'SHOW_PREVIEW',
		isVisible,
	};
} //end showPreview()

// ============
// HELPER TYPES
// ============

type ShowPreviewAction = {
	readonly type: 'SHOW_PREVIEW';
	readonly isVisible: boolean;
};
