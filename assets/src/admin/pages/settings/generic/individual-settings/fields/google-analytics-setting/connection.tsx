/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import { AnalyticsRefreshButton } from './analytics-refresh-button';

export type ConnectionProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly name: string;
	readonly selectProfile?: () => void;
	readonly mode:
		| 'init'
		| 'awaiting-profile-selection'
		| 'checking-google-analytics';
};

export const Connection = ( {
	className = '',
	disabled,
	mode,
	name,
	selectProfile = () => void null,
}: ConnectionProps ): JSX.Element => (
	<div className={ className }>
		<div className={ `${ className }__connection-actions` }>
			<Button
				variant="secondary"
				size="small"
				disabled={ disabled }
				onClick={ selectProfile }
			>
				{ _x( 'Connect Google Analytics', 'command', 'nelio-content' ) }
			</Button>
			<AnalyticsRefreshButton
				name={ name }
				className={ className }
				disabled={ disabled }
			/>
		</div>

		{ 'awaiting-profile-selection' === mode && (
			<div className={ `${ className }__overlay` }>
				<div className={ `${ className }__overlay-content` }>
					{ _x(
						'Please select a Google account…',
						'user',
						'nelio-content'
					) }
				</div>
			</div>
		) }

		{ 'checking-google-analytics' === mode && (
			<div className={ `${ className }__overlay` }>
				<div className={ `${ className }__overlay-content` }>
					{ _x( 'Please wait a moment…', 'user', 'nelio-content' ) }
				</div>
			</div>
		) }
	</div>
);
