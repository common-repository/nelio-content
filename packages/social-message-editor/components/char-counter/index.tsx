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
import { useCharCount, useMaxChars } from '../../hooks';

export const CharCounter = (): JSX.Element => {
	const charCount = useCharCount();
	const maxChars = useMaxChars();

	const isError = maxChars - charCount <= 0;
	const isWarning = ! isError && maxChars - charCount < 20;

	return (
		<div className="nelio-content-social-char-counter">
			<div
				className={ classnames( {
					'nelio-content-social-char-counter__count': true,
					'nelio-content-social-char-counter__count--is-warning':
						isWarning,
					'nelio-content-social-char-counter__count--is-error':
						isError,
				} ) }
			>
				{ Math.min( 99, Math.abs( maxChars - charCount ) ) }
			</div>

			<svg className="nelio-content-social-char-counter__circle">
				<circle
					className="nelio-content-social-char-counter__circle-base"
					cx="50%"
					cy="50%"
					r="8"
					fill="none"
					strokeWidth="1"
				></circle>
				<circle
					className={ classnames( {
						'nelio-content-social-char-counter__circle-arc': true,
						'nelio-content-social-char-counter__circle-arc--is-warning':
							isWarning,
						'nelio-content-social-char-counter__circle-arc--is-error':
							isError,
					} ) }
					cx="50%"
					cy="50%"
					r="8"
					fill="none"
					strokeWidth="2"
					style={ {
						strokeDashoffset:
							50 * ( 1 - Math.min( 1, charCount / maxChars ) ),
						strokeDasharray: 50,
					} }
				></circle>
			</svg>
		</div>
	);
};
