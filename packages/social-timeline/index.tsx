/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import type { Post, Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { Period } from './period';
import './style.scss';

export type SocialTimelineProps =
	| {
			readonly post: Post;
			readonly deleteMessage: ( id: Uuid ) => void;
			readonly deletingMessageIds: ReadonlyArray< Uuid >;
			readonly isTimelineBusy: boolean;
	  }
	| {
			readonly post: Post;
			readonly deleteMessage?: never;
			readonly deletingMessageIds?: never;
			readonly isTimelineBusy?: never;
	  };

export const SocialTimeline = ( props: SocialTimelineProps ): JSX.Element => (
	<div className="nelio-content-social-timeline">
		<Period period="day" { ...props } />
		<Period period="week" { ...props } />
		<Period period="month" { ...props } />
		<Period period="other" { ...props } />
	</div>
);
