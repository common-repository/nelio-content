/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { DropdownMenu } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';

import { CalendarModeSwitcher } from './calendar-mode-switcher';
import { Tools } from './tools';

export type MoreOptionsProps = {
	readonly className?: string;
};

export const MoreOptions = ( {
	className = '',
}: MoreOptionsProps ): JSX.Element => (
	<DropdownMenu
		className={ `nelio-content-more-options ${ className }` }
		icon="ellipsis"
		label={ _x( 'More tools & options', 'text', 'nelio-content' ) }
		toggleProps={ {
			tooltipPosition: 'bottom center',
		} }
	>
		{ ( { onClose }: { onClose: () => void } ) => (
			<>
				<CalendarModeSwitcher />
				<Tools close={ onClose } />
			</>
		) }
	</DropdownMenu>
);
