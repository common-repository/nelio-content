/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import { MaybeRelatedPost } from '../../quick-actions/maybe-related-post';

import { CharCounterWrapper } from '../../quick-actions/char-counter-wrapper';
import { ImageToggle } from '../../quick-actions/image-toggle';
import { VideoToggle } from '../../quick-actions/video-toggle';
import { PlaceholderInserter } from '../../quick-actions/placeholder-inserter';
import { PreviewToggle } from '../../quick-actions/preview-toggle';

import { TemplateSelector } from '../../quick-actions/template-selector';

export type QuickActionsProps = {
	readonly disabled?: boolean;
};

export const QuickActions = ( {
	disabled,
}: QuickActionsProps ): JSX.Element => (
	<div className="nelio-content-social-message-editor__quick-actions-wrapper">
		<MaybeRelatedPost disabled={ disabled } />

		<div className="nelio-content-social-message-editor__quick-actions">
			<TemplateSelector disabled={ disabled } />
			<PlaceholderInserter disabled={ disabled } />
			<ImageToggle disabled={ disabled } />
			<VideoToggle disabled={ disabled } />
			<PreviewToggle disabled={ disabled } />
			<CharCounterWrapper disabled={ disabled } />
		</div>
	</div>
);
