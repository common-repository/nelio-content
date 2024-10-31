/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Snackbar } from '@safe-wordpress/components';
import { useEffect, useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Uuid } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type PageTitleProps = {
	readonly isSubscribed: boolean;
	readonly siteId: Uuid;
};

export const PageTitle = ( {
	isSubscribed,
	siteId,
}: PageTitleProps ): JSX.Element => {
	const [ copied, setCopied ] = useState( false );

	useEffect( () => {
		const timeout = setTimeout( () => setCopied( false ), 1500 );
		return () => clearTimeout( timeout );
	}, [ copied ] );

	return (
		<h1 className="wp-heading-inline nelio-content-page-title">
			<span>
				{ isSubscribed
					? _x( 'Account Details', 'text', 'nelio-content' )
					: _x( 'Upgrade to Premium', 'user', 'nelio-content' ) }
			</span>
			<span className="nelio-content-page-title__support-key">
				<strong>
					{ _x( 'Support Key:', 'text', 'nelio-content' ) }
				</strong>
				<code>{ siteId }</code>
				{ !! navigator.clipboard?.writeText && (
					<Button
						icon="admin-page"
						onClick={ () =>
							! copied &&
							void navigator.clipboard
								.writeText( siteId )
								.then( () => setCopied( true ) )
						}
					/>
				) }
			</span>

			{ copied && (
				<Snackbar className="nelio-content-page-title__support-key-copied">
					{ _x( 'Copied!', 'text (support key)', 'nelio-content' ) }
				</Snackbar>
			) }
		</h1>
	);
};
