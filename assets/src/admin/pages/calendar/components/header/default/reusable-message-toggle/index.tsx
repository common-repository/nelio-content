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

export type ReusableMessageToggleProps = {
	readonly className?: string;
};

export const ReusableMessageToggle = ( {
	className = '',
}: ReusableMessageToggleProps ): JSX.Element => {
	const isActive = useSelect( ( select ) =>
		select( NC_CALENDAR ).isReusableMessageViewOpen()
	);
	const { toggleSidePane } = useDispatch( NC_CALENDAR );

	return (
		<div className={ className }>
			<Button
				className={ classnames( {
					[ className ]: true,
					'nelio-content-reusable-message-toggle': true,
					'nelio-content-reusable-message-toggle--is-toggled':
						isActive,
				} ) }
				icon="image-rotate"
				label={ _x( 'Reusable Messages', 'text', 'nelio-content' ) }
				tooltipPosition="bottom center"
				isPressed={ isActive }
				onClick={ () => toggleSidePane( 'reusable-messages' ) }
			/>
		</div>
	);
};
