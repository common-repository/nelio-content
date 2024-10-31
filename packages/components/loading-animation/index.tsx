/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Spinner } from '@safe-wordpress/components';

/**
 * Internal dependencies
 */
import './style.scss';
import Logo from './logo.svg';

export type LoadingAnimationProps = {
	readonly className?: string;
	readonly text?: string;
	readonly isSmall?: boolean;
};

export const LoadingAnimation = ( {
	className = '',
	text,
	isSmall,
}: LoadingAnimationProps ): JSX.Element =>
	isSmall ? (
		<div
			className={ `nelio-content-loading-animation nelio-content-loading-animation--is-small ${ className }` }
		>
			<Spinner />
			{ !! text && (
				<div className="nelio-content-loading-animation__text nelio-content-loading-animation__text--is-small">
					{ text }
				</div>
			) }
		</div>
	) : (
		<div
			className={ `nelio-content-loading-animation nelio-content-loading-animation--is-large ${ className }` }
		>
			<Logo className="nelio-content-loading-animation__logo" />
			{ !! text && (
				<p className="nelio-content-loading-animation__text nelio-content-loading-animation__text--is-large">
					{ text }
				</p>
			) }
		</div>
	);
