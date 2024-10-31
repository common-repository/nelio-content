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

export type ToggleUnscheduledViewButtonProps = {
	readonly className?: string;
};

export const ToggleUnscheduledViewButton = ( {
	className = '',
}: ToggleUnscheduledViewButtonProps ): JSX.Element => {
	const isUnscheduledViewOpen = useSelect( ( select ) =>
		select( NC_CALENDAR ).isUnscheduledViewOpen()
	);
	const { toggleSidePane } = useDispatch( NC_CALENDAR );

	return (
		<div className={ className }>
			<Button
				className={ classnames( {
					[ className ]: true,
					'nelio-content-toggle-unscheduled-posts-button': true,
					'nelio-content-toggle-unscheduled-posts-button--is-toggled':
						isUnscheduledViewOpen,
				} ) }
				icon="portfolio"
				label={ _x( 'Unscheduled Content', 'text', 'nelio-content' ) }
				tooltipPosition="bottom center"
				isPressed={ isUnscheduledViewOpen }
				onClick={ () => toggleSidePane( 'unscheduled-posts' ) }
			/>
		</div>
	);
};
