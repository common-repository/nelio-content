/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { StylizedSelectControl } from '@nelio-content/components';
import { map } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { DEFAULT_ATTRS } from './config';
import { useAttributes, useValue } from '../hooks';
import type { Value } from './config';
import type { FieldSettingProps } from '../types';

export const PostTypeSetting = ( { name }: FieldSettingProps ): JSX.Element => {
	const helpIcon = useSelect( ( select ) =>
		select( NC_DATA ).getPluginUrl(
			'/includes/lib/settings/assets/images/help.png'
		)
	);
	const [ value = [], setValue ] = useValue< Value >( name );
	const [ isHelpVisible, showHelp ] = useState( false );
	const [ attributes ] = useAttributes( name, DEFAULT_ATTRS );
	const options = attributes.postTypes;
	const selection = options.filter( ( { value: v } ) => value.includes( v ) );

	const toggleHelp = () => showHelp( ! isHelpVisible );

	return (
		<>
			<div className="nelio-content-post-type-setting">
				<input type="hidden" name={ name } value={ value } />
				{ /* eslint-disable */ }
				{ !! attributes.help && (
					<img
						alt={ _x( 'Help', 'command', 'nelio-content' ) }
						className="nelio-content-post-type-setting--help"
						src={ helpIcon }
						onClick={ toggleHelp }
						height="16"
						width="16"
					/>
				) }
				{ /* eslint-enable */ }
				<StylizedSelectControl
					className="nelio-content-post-type-setting--select"
					isMulti
					isMandatory={ attributes.isMandatory }
					options={ options }
					value={ selection }
					onChange={ ( newValue ) =>
						setValue( map( newValue, 'value' ) )
					}
				/>
			</div>
			{ isHelpVisible && (
				<p className="description">{ attributes.help }</p>
			) }
		</>
	);
};
