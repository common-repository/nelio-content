/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './style.scss';

export type ProgressBarProps = {
	readonly current?: number;
	readonly total?: number;
	readonly label: string;
};

export const ProgressBar = ( {
	current = 0,
	total = 1,
	label,
}: ProgressBarProps ): JSX.Element => (
	<div className="nelio-content-progress-bar">
		<div
			className={ classnames( {
				'nelio-content-progress-bar__actual-bar': true,
				'nelio-content-progress-bar__actual-bar--is-animated':
					current < total,
			} ) }
			style={ {
				width: `${ perc( current, total ) }%`,
			} }
		></div>
		{ !! label && (
			<div className="nelio-content-progress-bar__label-wrapper">
				<div className="nelio-content-progress-bar__label">
					{ label }
				</div>
			</div>
		) }
	</div>
);

// =======
// HELPERS
// =======

function perc( i: number, n: number ) {
	n = n < 1 ? 1 : n;

	i = i < 0 ? 0 : i;
	i = i > n ? n : i;

	const q = i / n;
	return Math.round( q * 100 );
} //end perc()
