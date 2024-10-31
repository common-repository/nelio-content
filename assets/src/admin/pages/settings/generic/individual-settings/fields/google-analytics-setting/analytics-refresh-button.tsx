/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Modal, SelectControl } from '@safe-wordpress/components';
import { _x, _nx, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { ProgressBar } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { refreshAnalytics } from './utils';
import { useAttributes } from '../hooks';
import { DEFAULT_ATTRS } from './config';
import type { Attrs } from './config';

export type AnalyticsRefreshButtonProps = {
	readonly className: string;
	readonly disabled?: boolean;
	readonly name: string;
};

export const AnalyticsRefreshButton = ( {
	className,
	name,
	disabled,
}: AnalyticsRefreshButtonProps ): JSX.Element => {
	const [ attributes, setAttributes ] = useAttributes( name, DEFAULT_ATTRS );

	const {
		error,
		refreshDisabled,
		isRefreshDialogOpen: isDialogOpen,
		isRefreshing,
		isStartingRefresh,
		isRefreshingOver,
		refreshPeriod: period,
		refreshPostCount: postCount,
		refreshPostIndex: postIndex,
	} = attributes;

	const openDialog = () =>
		setAttributes( {
			error: false,
			isRefreshDialogOpen: true,
			isRefreshing: false,
			refreshPeriod: 'month',
		} );

	const closeDialog = () =>
		setAttributes( {
			error: false,
			isRefreshDialogOpen: false,
			isRefreshing: false,
			isStartingRefresh: false,
			isRefreshingOver: false,
			refreshPeriod: 'month',
			refreshPostCount: 0,
			refreshPostIndex: 0,
		} );

	const setPeriod = ( refreshPeriod: Attrs[ 'refreshPeriod' ] ) =>
		setAttributes( { refreshPeriod } );

	const refresh = () =>
		refreshAnalytics( period, ( attrs ) => setAttributes( attrs ) );

	return (
		<>
			<Button
				variant="secondary"
				size="small"
				disabled={ disabled || refreshDisabled }
				onClick={ openDialog }
			>
				{ _x( 'Refresh Analytics', 'command', 'nelio-content' ) }
			</Button>

			{ isDialogOpen && (
				<Modal
					isDismissible={ false }
					title={ _x( 'Refresh Analytics', 'text', 'nelio-content' ) }
					onRequestClose={ () => void null }
				>
					<div className={ `${ className }__dialog-content` }>
						{ ! isRefreshing && ! isRefreshingOver && (
							<SelectControl
								disabled={ isRefreshing }
								value={ period }
								onChange={ setPeriod }
								options={ PERIOD_OPTIONS }
							/>
						) }

						{ isStartingRefresh && (
							<ProgressBar
								label={ _x(
									'Retrieving posts…',
									'text',
									'nelio-content'
								) }
							/>
						) }

						{ isRefreshing && ! isStartingRefresh && (
							<ProgressBar
								current={ postIndex }
								total={ postCount }
								label={ `${ postIndex } / ${ postCount }` }
							/>
						) }

						{ isRefreshingOver && (
							<ProgressBar
								current={ postIndex }
								total={ postCount }
								label={ sprintf(
									/* translators: number of posts */
									_nx(
										'%d post updated!',
										'%d posts updated!',
										postCount,
										'text',
										'nelio-content'
									),
									postCount
								) }
							/>
						) }

						{ !! error && (
							<p className={ `${ className }__error-message` }>
								{ error }
							</p>
						) }
					</div>

					<div className={ `${ className }__dialog-actions` }>
						<Button
							variant="secondary"
							disabled={ isRefreshing }
							onClick={ closeDialog }
						>
							{ _x( 'Close', 'command', 'nelio-content' ) }
						</Button>
						{ ! isRefreshingOver && (
							<Button
								variant="primary"
								isBusy={ isRefreshing }
								disabled={ isRefreshing }
								onClick={ refresh }
							>
								{ isRefreshing
									? _x(
											'Refreshing…',
											'text',
											'nelio-content'
									  )
									: _x(
											'Refresh Analytics',
											'command',
											'nelio-content'
									  ) }
							</Button>
						) }
					</div>
				</Modal>
			) }
		</>
	);
};

// ====
// DATA
// ====

const PERIOD_OPTIONS: ReadonlyArray< {
	readonly value: Attrs[ 'refreshPeriod' ];
	readonly label: string;
} > = [
	{
		value: 'month',
		label: _x( 'Posts from last month', 'text', 'nelio-content' ),
	},
	{
		value: 'year',
		label: _x( 'Posts from last year', 'text', 'nelio-content' ),
	},
	{
		value: 'all',
		label: _x( 'All posts', 'text', 'nelio-content' ),
	},
];
