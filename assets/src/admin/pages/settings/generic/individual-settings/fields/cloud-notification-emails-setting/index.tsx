/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import apiFetch from '@safe-wordpress/api-fetch';
import { Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';
import { DEFAULT_ATTRS } from './config';
import { useAttributes, useValue } from '../hooks';
import type { FieldSettingProps } from '../types';

type Response = {
	readonly notificationEmails?: ReadonlyArray< string >;
};

export const CloudNotificationEmailsSetting = ( {
	name,
}: FieldSettingProps ): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );
	const [ value = [], setValue ] =
		useValue< ReadonlyArray< string > >( name );

	const siteId = useSelect( ( select ) => select( NC_DATA ).getSiteId() );
	const apiRoot = useSelect( ( select ) => select( NC_DATA ).getApiRoot() );
	const token = useSelect( ( select ) =>
		select( NC_DATA ).getAuthenticationToken()
	);

	const { status } = attributes;

	useEffect( () => {
		void ( async () => {
			if ( ! siteId || ! token ) {
				return;
			} //end if

			try {
				const response = await apiFetch< Response >( {
					url: `${ apiRoot }/site/${ siteId }`,
					method: 'GET',
					credentials: 'omit',
					mode: 'cors',
					headers: {
						Authorization: `Bearer ${ token }`,
					},
				} );

				const { notificationEmails = [] } = response;
				setValue( notificationEmails );
				setAttributes( { status: 'ready' } );
			} catch ( _ ) {
				setValue( [] );
				setAttributes( { status: 'error' } );
			} //end catch
		} )();
	}, [ siteId, token ] );

	return (
		<div className="nelio-content-cloud-notification-emails-setting">
			{ 'loading' === status && <Spinner /> }
			{ 'error' === status && (
				<p className="nelio-content-cloud-notification-emails-setting__error-message">
					{ _x(
						'Unable to retrieve cloud notification emails. Please try again later.',
						'user',
						'nelio-content'
					) }
				</p>
			) }
			{ 'ready' === status && (
				<>
					<input
						type="hidden"
						name={ name }
						value={ value
							.map( ( x ) => x.replace( /\s/g, '' ) )
							.filter( Boolean )
							.join( ',' ) }
					/>
					<p>
						{ _x(
							'Please write one email address per line:',
							'user',
							'nelio-content'
						) }
					</p>
					<textarea
						className="nelio-content-cloud-notification-emails-setting__input"
						placeholder={ _x(
							'user@example.com',
							'text',
							'nelio-content'
						) }
						value={ value.join( '\n' ) }
						onChange={ ( ev ) =>
							setValue( ev.target.value.split( '\n' ) )
						}
					/>
					<p>
						<span className="description">
							{ _x(
								'Send email notifications to the addresses above when a social profile expires and requires re-authentication.',
								'text',
								'nelio-content'
							) }
						</span>
					</p>
				</>
			) }
		</div>
	);
};
