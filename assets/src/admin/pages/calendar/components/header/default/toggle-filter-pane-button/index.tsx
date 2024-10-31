/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_CALENDAR } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

export type ToggleFilterPaneButtonProps = {
	readonly className?: string;
};

export const ToggleFilterPaneButton = ( {
	className = '',
}: ToggleFilterPaneButtonProps ): JSX.Element => {
	const { toggleSidePane } = useDispatch( NC_CALENDAR );
	const isFilterPaneOpen = useSelect( ( select ) =>
		select( NC_CALENDAR ).isFilterPaneOpen()
	);
	const areThereActiveFilters = useSelect( ( select ) =>
		select( NC_CALENDAR ).areThereActiveFilters()
	);

	return (
		<div className={ className }>
			<Button
				className={ classnames( {
					[ className ]: true,
					'nelio-content-toggle-filter-pane-button': true,
					'nelio-content-toggle-filter-pane-button--has-active-filters':
						areThereActiveFilters,
					'nelio-content-toggle-filter-pane-button--is-toggled':
						isFilterPaneOpen,
				} ) }
				icon="filter"
				label={
					isFilterPaneOpen
						? _x( 'Hide Filters', 'command', 'nelio-content' )
						: _x( 'Show Filters', 'command', 'nelio-content' )
				}
				tooltipPosition="bottom center"
				isPressed={ isFilterPaneOpen }
				onClick={ () => toggleSidePane( 'filters' ) }
			/>
		</div>
	);
};
