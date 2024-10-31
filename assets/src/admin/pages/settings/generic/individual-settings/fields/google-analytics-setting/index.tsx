/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';

/**
 * Internal dependencies
 */
import './style.scss';

import { useAttributes } from '../hooks';
import { openGAProfileSelector } from './utils';

import { Connection } from './connection';

import { DEFAULT_ATTRS } from './config';
import type { Attrs } from './config';
import { PropertyControl } from './property-control';
import type { FieldSettingProps } from '../types';

export const GoogleAnalyticsSetting = ( {
	name,
}: FieldSettingProps ): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );
	const setMode = ( m: Attrs[ 'mode' ] ) =>
		setAttributes( { mode: m, refreshDisabled: true } );

	const { disabled, mode } = attributes;

	if ( 'ga4-property-id' === mode ) {
		return (
			<PropertyControl
				className="nelio-content-google-analytics-setting"
				disabled={ disabled }
				name={ name }
			/>
		);
	} //end if

	return (
		<Connection
			className="nelio-content-google-analytics-setting"
			name={ name }
			disabled={ disabled }
			mode={ mode }
			selectProfile={ () =>
				openGAProfileSelector( {
					onOpen: () => setMode( 'awaiting-profile-selection' ),
					onClose: () => {
						setMode( 'checking-google-analytics' );
						void apiFetch< boolean >( {
							path: '/nelio-content/v1/analytics/check',
						} ).then( ( hasGA ) =>
							setMode( hasGA ? 'ga4-property-id' : 'init' )
						);
					},
				} )
			}
		/>
	);
};
