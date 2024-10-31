/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import { pascalCase } from '@nelio-content/utils';
import type { LegacyRef } from 'react';
import type {
	Maybe,
	PremiumItem,
	PremiumItemSummaries,
	PremiumItems,
	PremiumItemType,
	ItemType,
} from '@nelio-content/types';

type CB = ( ...args: unknown[] ) => void;

// ----------------------------
// Premium calendar item view
// ----------------------------

type ViewComponent< TId = unknown > = ( props: {
	readonly className: string;
	readonly itemId: TId;
	readonly dragReference: LegacyRef< HTMLDivElement >;
	readonly isClickable: boolean;
} ) => JSX.Element | null;

const NULL = () => null;
export function getPremiumCalendarItemView(
	typeName: PremiumItemType
): ViewComponent {
	return applyFilters(
		'nelio-content_premium-hooks-for-pages_getPremiumCalendarItemView',
		NULL,
		typeName
	) as ViewComponent;
} //end getPremiumCalendarItemView()

export function setPremiumCalendarItemView< Type extends PremiumItemType >(
	typeName: Type,
	component: ViewComponent< PremiumItemSummaries[ Type ][ 'id' ] >
): void {
	addFilter(
		'nelio-content_premium-hooks-for-pages_getPremiumCalendarItemView',
		`getPremium${ pascalCase( typeName ) }View`,
		( (
			defaultComponent: ViewComponent,
			actualTypeName: PremiumItemType
		) =>
			typeName === actualTypeName ? component : defaultComponent ) as CB
	);
} //end getPremiumCalendarItemView()

// ----------------------------
// Is item draggable?
// ----------------------------

export function isItemTypeDraggable( typeName: ItemType ): boolean {
	switch ( typeName ) {
		case 'post':
		case 'task':
		case 'social':
			return true;

		case 'external-event':
		case 'internal-event':
			return false;

		default:
			return isPremiumItemTypeDraggable( typeName );
	} //end switch
} //end isItemTypeDraggable()

function isPremiumItemTypeDraggable( typeName: PremiumItemType ): boolean {
	return !! applyFilters(
		'nelio-content_premium-hooks-for-pages_isPremiumItemTypeDraggable',
		false,
		typeName
	);
} //end isPremiumItemTypeDraggable()

export function onIsPremiumItemTypeDraggable(
	typeName: PremiumItemType,
	callback: ( isDraggable: boolean ) => boolean
): void {
	addFilter(
		'nelio-content_premium-hooks-for-pages_isPremiumItemTypeDraggable',
		`isPremium${ pascalCase( typeName ) }Draggable`,
		( ( isDraggable: boolean, actualTypeName: PremiumItemType ) =>
			typeName === actualTypeName
				? callback( isDraggable )
				: isDraggable ) as CB
	);
} //end onIsPremiumItemTypeDraggable()

// ----------------------------
// Is premium item visible?
// ----------------------------

export function isPremiumItemVisible(
	typeName: PremiumItemType,
	item: PremiumItem
): boolean {
	return !! applyFilters(
		'nelio-content_premium-hooks-for-pages_isPremiumItemVisibleInCalendar',
		false,
		typeName,
		item
	);
} //end isPremiumItemVisible()

export function onIsPremiumItemVisible< TName extends PremiumItemType >(
	typeName: TName,
	callback: ( isVisible: boolean, item: PremiumItems[ TName ] ) => boolean
): void {
	addFilter(
		'nelio-content_premium-hooks-for-pages_isPremiumItemVisibleInCalendar',
		`isPremium${ pascalCase( typeName ) }VisibleInCalendar`,
		( (
			isVisible: boolean,
			actualTypeName: PremiumItemType,
			item: PremiumItems[ TName ]
		) =>
			typeName === actualTypeName
				? callback( isVisible, item )
				: isVisible ) as CB
	);
} //end onIsPremiumItemVisible()

// ----------------------------
// Is premium item in segment?
// ----------------------------

export function isPremiumItemInSegment(
	typeName: PremiumItemType,
	item: PremiumItem,
	segmentHour: number
): boolean {
	return !! applyFilters(
		'nelio-content_premium-hooks-for-pages_isPremiumItemInCalendarSegment',
		false,
		typeName,
		item,
		segmentHour
	);
} //end isPremiumItemInSegment()

export function onIsPremiumItemInSegment< TName extends PremiumItemType >(
	typeName: TName,
	callback: (
		isInSegment: boolean,
		item: PremiumItems[ TName ],
		segmentHour: number
	) => boolean
): void {
	addFilter(
		'nelio-content_premium-hooks-for-pages_isPremiumItemInCalendarSegment',
		`isPremium${ pascalCase( typeName ) }InCalendarSegment`,
		( (
			isInSegment: boolean,
			actualTypeName: PremiumItemType,
			item: PremiumItems[ TName ],
			segmentHour: number
		) =>
			typeName === actualTypeName
				? callback( isInSegment, item, segmentHour )
				: isInSegment ) as CB
	);
} //end onIsPremiumItemInSegment()

// ----------------------------
// Get min schedule
// ----------------------------

export function getPremiumItemsMinDroppableDay(
	type: PremiumItemType,
	item: Maybe< PremiumItem >
): Maybe< string > {
	return applyFilters(
		'nelio-content_premium-hooks-for-pages_getPremiumItemsMinDroppableDay',
		undefined,
		type,
		item
	) as Maybe< string >;
} //end getPremiumItemsMinDroppableDay()

export function onGetPremiumItemsMinDroppableDay<
	TName extends PremiumItemType,
>(
	typeName: TName,
	callback: (
		day: Maybe< string >,
		item: PremiumItems[ TName ]
	) => Maybe< string >
): void {
	addFilter(
		'nelio-content_premium-hooks-for-pages_getPremiumItemsMinDroppableDay',
		`getPremium${ pascalCase( typeName ) }sMinDroppableDay`,
		( (
			day: Maybe< string >,
			actualTypeName: PremiumItemType,
			item: Maybe< PremiumItems[ TName ] >
		) =>
			typeName === actualTypeName && !! item
				? callback( day, item )
				: day ) as CB
	);
} //end onGetPremiumItemsMinDroppableDay()
