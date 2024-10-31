/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { useDayType, useNonCollapsedDayItems } from '@nelio-content/calendar';

/**
 * Internal dependencies
 */
import { Item } from '../../item';
import { CollapsedSocialMessagesWrapper } from '../../collapsed-social-messages-wrapper';

export type ItemListProps = {
	readonly day: string;
};

export const ItemList = ( { day }: ItemListProps ): JSX.Element => {
	const items = useNonCollapsedDayItems( day );
	const dayType = useDayType( day );
	return (
		<div
			className={ `nelio-content-calendar-day__items nelio-content-calendar-day__items--${ dayType }` }
		>
			{ items.map( ( item ) => (
				<Item
					key={ `${ item.type }-${ item.id }` }
					itemId={ item.id }
					itemType={ item.type }
				/>
			) ) }

			<CollapsedSocialMessagesWrapper day={ day } />
		</div>
	);
};
