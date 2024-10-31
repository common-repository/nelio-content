/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';
import { extractDateTimeValues } from '@nelio-content/utils';
import { isPremiumItemInSegment } from '@nelio-content/premium-hooks-for-pages';
import type {
	Item as ItemInstance,
	ItemSummary,
	Post,
	PremiumItem,
	SocialMessage,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { Item } from '../../item';

export type ItemListProps = {
	readonly day: string;
	readonly hour: number;
};

export const ItemList = ( { day, hour }: ItemListProps ): JSX.Element => {
	const items = useItems( day, hour );
	return (
		<div>
			{ items.map( ( item ) => (
				<Item
					key={ `${ item.type }-${ item.id }` }
					itemId={ item.id }
					itemType={ item.type }
				/>
			) ) }
		</div>
	);
};

// =====
// HOOKS
// =====

const useItems = ( day: string, hour: number ) =>
	useSelect( ( select ) => {
		const { getItem, getItemsInDay } = select( NC_DATA );
		const { isItemVisible } = select( NC_CALENDAR );
		return filter( getItemsInDay( day ), ( { id, type } ) => {
			const item = getItem( type, id );
			return (
				!! item &&
				isItemVisible( type, item ) &&
				isItemInSegment( type, item, hour )
			);
		} );
	} );

// =======
// HELEPRS
// =======

function isItemInSegment(
	type: ItemSummary[ 'type' ],
	item: ItemInstance,
	segmentHour: number
): boolean {
	switch ( type ) {
		case 'external-event':
		case 'internal-event':
		case 'task':
			return segmentHour === 0;

		case 'post':
		case 'social': {
			const dateTime =
				type === 'post'
					? ( item as Post ).date
					: ( item as SocialMessage ).schedule;
			const dtv = extractDateTimeValues( dateTime );
			if ( ! dtv ) {
				return false;
			} //end if
			const { timeValue } = dtv;
			const hour = Number.parseInt( timeValue.substring( 0, 2 ) );

			return hour >= segmentHour && hour < segmentHour + 4;
		}

		default:
			return isPremiumItemInSegment(
				type,
				item as PremiumItem,
				segmentHour
			);
	} //end switch
} //end isItemInSegment()
