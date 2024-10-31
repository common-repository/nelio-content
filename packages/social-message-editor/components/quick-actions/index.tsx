/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * Internal dependencies
 */
import './style.scss';

import { MaybeRelatedPost } from './maybe-related-post';

import { CharCounterWrapper } from './char-counter-wrapper';
import { ImageToggle } from './image-toggle';
import { VideoToggle } from './video-toggle';
import { ExistingMessageSelector } from './existing-message-selector';
import { RecurrenceToggle } from './recurrence-toggle';
import { PlaceholderInserter } from './placeholder-inserter';
import { PreviewToggle } from './preview-toggle';

import { TemplateSelector } from './template-selector';

export type QuickActionsProps = {
	readonly disabled?: boolean;
};

export const QuickActions = ( {
	disabled,
}: QuickActionsProps ): JSX.Element => (
	<div className="nelio-content-social-message-editor__quick-actions-wrapper">
		<MaybeRelatedPost disabled={ disabled } />

		<div className="nelio-content-social-message-editor__quick-actions">
			<ExistingMessageSelector disabled={ disabled } />
			<TemplateSelector disabled={ disabled } />
			<PlaceholderInserter disabled={ disabled } />
			<RecurrenceToggle disabled={ disabled } />
			<ImageToggle disabled={ disabled } />
			<VideoToggle disabled={ disabled } />
			<PreviewToggle disabled={ disabled } />
			<CharCounterWrapper disabled={ disabled } />
		</div>
	</div>
);
