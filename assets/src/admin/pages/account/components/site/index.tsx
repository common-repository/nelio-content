/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { HelpIcon, ConfirmationDialog } from '@nelio-content/components';
import type { Site as SiteType } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export type SiteProps = {
	readonly site: SiteType;
};

export const Site = ( { site }: SiteProps ): JSX.Element => {
	const [ isConfirmVisible, setConfirmVisible ] = useState( false );
	const { removeLicense } = useDispatch( NC_ACCOUNT );
	const isLocked = useSelect( ( select ) => select( NC_ACCOUNT ).isLocked() );

	const { isCurrentSite, url, actualUrl } = site;
	return (
		<li className="nelio-content-site">
			{ isCurrentSite ? (
				<span className="nelio-content-site__url">
					<span className="nelio-content-site__current-site">
						{ actualUrl }
						{ !! actualUrl && url !== actualUrl && (
							<HelpIcon
								className="nelio-content-site__current-site-help"
								type="info"
								text={ sprintf(
									/* translators: site URL */
									_x(
										'Activation URL is “%s”',
										'text',
										'nelio-content'
									),
									url
								) }
							/>
						) }
					</span>
					<span className="nelio-content-site__label">
						{ _x( 'This site', 'text', 'nelio-content' ) }
					</span>
				</span>
			) : (
				<>
					<span className="nelio-content-site__url">
						<a
							href={ url }
							className={ classnames(
								'nelio-content-site__link',
								{
									'nelio-content-site__link--current':
										isCurrentSite,
								}
							) }
							target="_blank"
							rel="noopener noreferrer"
						>
							{ url }
						</a>
					</span>
					<Button
						isDestructive
						variant="tertiary"
						className="nelio-content-site__unlink-button"
						onClick={ () => setConfirmVisible( true ) }
						disabled={ isLocked }
					>
						{ _x( 'Unlink Site', 'command', 'nelio-content' ) }
					</Button>
					<ConfirmationDialog
						title={ _x( 'Unlink Site?', 'text', 'nelio-content' ) }
						text={ _x(
							'This will remove the subscription license from the site.',
							'text',
							'nelio-content'
						) }
						confirmLabel={ _x(
							'Unlink',
							'command',
							'nelio-content'
						) }
						isOpen={ isConfirmVisible }
						onCancel={ () => setConfirmVisible( false ) }
						onConfirm={ () => {
							setConfirmVisible( false );
							void removeLicense( site.id );
						} }
					/>
				</>
			) }
		</li>
	);
};
