/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink, TextControl } from '@safe-wordpress/components';
import { createInterpolateElement } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { AnalyticsRefreshButton } from './analytics-refresh-button';
import { useAttributes, useValue } from '../hooks';
import { DEFAULT_ATTRS } from './config';

export type ViewSelectorProps = {
	readonly className: string;
	readonly disabled?: boolean;
	readonly name: string;
};

export const PropertyControl = ( {
	className,
	disabled,
	name,
}: ViewSelectorProps ): JSX.Element => {
	const [ value = '', doSetValue ] = useValue< string >( name );
	const [ _, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );

	const setValue = ( v: string ) => {
		setAttributes( { refreshDisabled: true } );
		doSetValue( v );
	};

	const reset = () => {
		setAttributes( { mode: 'init', refreshDisabled: true } );
		setValue( '' );
	};

	return (
		<div className={ className }>
			<div className={ `${ className }__property-control` }>
				<input type="hidden" name={ name } value={ value } />
				<TextControl
					placeholder={ _x(
						'GA4 Property Identifier',
						'text',
						'nelio-content'
					) }
					disabled={ disabled }
					value={ value }
					onChange={ setValue }
					help={ createInterpolateElement(
						sprintf(
							'<span>%s</span>',
							_x(
								'To determine your GA4 Property Id, please <a>follow these instructions</a>',
								'user',
								'nelio-content'
							)
						),
						{
							a: (
								// @ts-expect-error children prop is set by createInterpolateComponent.
								<ExternalLink href="https://developers.google.com/analytics/devguides/reporting/data/v1/property-id#google_analytics" />
							),
							span: <span className="description"></span>,
						}
					) }
				/>
			</div>

			<div className={ `${ className }__property-control-actions` }>
				<Button
					variant="secondary"
					size="small"
					disabled={ disabled }
					onClick={ reset }
				>
					{ _x(
						'Remove Google Analytics',
						'command',
						'nelio-content'
					) }
				</Button>
				<AnalyticsRefreshButton
					name={ name }
					className={ className }
					disabled={ disabled }
				/>
			</div>
		</div>
	);
};
