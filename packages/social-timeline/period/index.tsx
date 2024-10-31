/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Post, TimelinePeriod } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { PeriodContent } from './content';
import type { PeriodContentProps } from './content';

export type PeriodProps = PeriodContentProps;

export const Period = ( props: PeriodProps ): JSX.Element => {
	const title = getTitle( props.period, props.post );
	return (
		<div className="nelio-content-social-media-timeline-period">
			<div className="nelio-content-social-media-timeline-period__title">
				{ title }
			</div>
			<PeriodContent { ...props } />
		</div>
	);
};

// =====
// HOOKS
// =====

function getTitle( period: TimelinePeriod, post: Post ) {
	switch ( period ) {
		case 'day':
			return 'publish' === post.status
				? _x( 'Today', 'text', 'nelio-content' )
				: _x( 'Publication Day', 'text', 'nelio-content' );

		case 'week':
			return _x( 'Week', 'text', 'nelio-content' );

		case 'month':
			return _x( 'Month', 'text', 'nelio-content' );

		case 'other':
			return _x( 'Other', 'text', 'nelio-content' );
	} //end switch
} //end getTitle()
