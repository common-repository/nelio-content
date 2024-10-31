/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Dashicon } from '@safe-wordpress/components';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	useDraggingItem,
	useCollapsableItemCount,
	useHoverItem,
	useDayCollapser,
	useDayType,
} from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import './style.scss';

export type CollapsedSocialMessagesWrapperProps = {
	readonly day: string;
};

export const CollapsedSocialMessagesWrapper = ( {
	day,
}: CollapsedSocialMessagesWrapperProps ): JSX.Element | null => {
	const hasDraggingItem = !! useDraggingItem();
	const hasHoverItem = !! useHoverItem();
	const isLocked = hasDraggingItem || hasHoverItem;

	const collapsableCount = useCollapsableItemCount( day );
	const [ isCollapsed, collapse ] = useDayCollapser( day );
	const dayType = useDayType( day );

	if ( ! collapsableCount ) {
		return null;
	} //end if

	if ( ! isCollapsed ) {
		return (
			<Button
				className="nelio-content-collapsed-social-messages-wrapper"
				disabled={ isLocked }
				onClick={ () => collapse( true ) }
			>
				<span>{ _x( 'Collapse', 'command', 'nelio-content' ) }</span>
				<Dashicon icon="arrow-up" />
			</Button>
		);
	} //end if

	return (
		<Button
			className={ classnames( {
				'nelio-content-collapsed-social-messages-wrapper': true,
				'nelio-content-collapsed-social-messages-wrapper--is-blurred':
					! isLocked && 'past-day' === dayType,
			} ) }
			disabled={ isLocked }
			onClick={ () => collapse( false ) }
		>
			<span>
				{ sprintf(
					/* translators: number of hidden messages on a certain day in the Editorial Calendar */
					_x( '+%d more', 'command', 'nelio-content' ),
					collapsableCount
				) }
			</span>
			<Dashicon icon="arrow-down" />
		</Button>
	);
};
