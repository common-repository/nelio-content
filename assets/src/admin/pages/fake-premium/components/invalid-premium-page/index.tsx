/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useState } from '@safe-wordpress/element';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { Button, NoticeList } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';
import { store as NOTICES } from '@safe-wordpress/notices';

/**
 * External dependencies
 */
import { store as NC_DATA, useAdminUrl } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import NelioContentLogo from '~/nelio-content-images/full-logo.svg';
import './style.scss';
import type { Page } from '../../utils';

type Props = {
	readonly page: Page;
	readonly reason: 'invalid-version' | 'missing';
};

export const InvalidPremiumPage = ( { page, reason }: Props ): JSX.Element => {
	const isInstalled = useSelect(
		( select ) => 'uninstalled' !== select( NC_DATA ).getPremiumStatus()
	);

	const { title, subtitle } = TITLES[ page ];

	const { notices, removeNotice, createErrorNotice } = useNotices();
	const pluginsUrl = useAdminUrl( 'plugins.php' );
	const { installPremium } = useDispatch( NC_DATA );
	const [ updating, setUpdating ] = useState< boolean >( false );
	const onUpdate = () => {
		setUpdating( true );
		void installPremium( ( data ) => {
			if ( data.success ) {
				return window.location.reload();
			} //end if

			void createErrorNotice( data.message );
			setUpdating( false );
		} );
	};

	const regularLabel = isInstalled
		? _x( 'Activate Nelio Content Premium', 'text', 'nelio-content' )
		: _x( 'Install Nelio Content Premium', 'text', 'nelio-content' );
	const processingLabel = isInstalled
		? _x( 'Activating Nelio Content Premium…', 'text', 'nelio-content' )
		: _x( 'Installing Nelio Content Premium…', 'text', 'nelio-content' );

	return (
		<>
			<NoticeList
				notices={ notices }
				className="components-editor-notices__pinned"
				onRemove={ removeNotice }
			/>
			<div className="nelio-content-invalid-premium-page">
				<div className="nelio-content-invalid-premium-page__primary">
					<div className="nelio-content-invalid-premium-page__logo">
						<NelioContentLogo />
					</div>
					<h2 className="nelio-content-invalid-premium-page__title">
						{ title }
					</h2>
					<p className="nelio-content-invalid-premium-page__subtitle">
						{ subtitle }
					</p>
					<div className="nelio-content-invalid-premium-page__button-wrapper">
						{ 'invalid-version' === reason ? (
							<a
								className="nelio-content-invalid-premium-page__main-button components-button is-primary"
								rel="external noreferrer noopener"
								href={ pluginsUrl }
							>
								{ _x(
									'Update Nelio Content',
									'command',
									'nelio-content'
								) }
							</a>
						) : (
							<Button
								variant="primary"
								className="nelio-content-invalid-premium-page__main-button components-button"
								onClick={ onUpdate }
								disabled={ updating }
								isBusy={ updating }
							>
								{ updating ? processingLabel : regularLabel }
							</Button>
						) }
					</div>
				</div>
			</div>
		</>
	);
};

// =====
// HOOKS
// =====

const useNotices = () => {
	const notices = useSelect( ( select ) => select( NOTICES ).getNotices() );
	const { removeNotice, createErrorNotice } = useDispatch( NOTICES );
	return { notices, removeNotice, createErrorNotice };
};

// =======
// HELPERS
// =======

const TITLES: Record< Props[ 'page' ], { title: string; subtitle: string } > = {
	'content-board': {
		title: _x( 'Content Board', 'text', 'nelio-content' ),
		subtitle: _x(
			'Manage your WordPress content using a Kanban-like view',
			'user',
			'nelio-content'
		),
	},
};
