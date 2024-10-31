/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import {
	select as doSelect,
	dispatch,
	useDispatch,
	useSelect,
} from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { debounce, drop, map, filter, find, padStart } from 'lodash';
import { v4 as uuid } from 'uuid';
import { store as NC_DATA, useFeatureGuard } from '@nelio-content/data';
import { store as NC_POST_EDITOR } from '@nelio-content/post-quick-editor';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import { store as NC_TASK_EDITOR } from '@nelio-content/task-editor';
import {
	createItemSummary,
	createPremiumItemSummary,
	createSocialMessage,
	extractDateTimeValues,
	getSocialMessageSchedule,
	isFreeItemType,
	isRecurringMessage,
	isRecurringSource,
	showErrorNotice,
} from '@nelio-content/utils';
import type {
	Dict,
	DraggableItemSummary,
	EditorialTask,
	FreeItem,
	ItemSummary,
	Maybe,
	Post,
	PostId,
	PostStatus,
	PostStatusSlug,
	PostTypeName,
	PremiumItem,
	ReusableSocialMessageId,
	SocialMessage,
	SocialMessageSummary,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_CALENDAR } from './store';
import type { CalendarPane } from './store/settings/config';

type CalendarItem = Post | SocialMessage | EditorialTask | PremiumItem;
type CalendarItemId = CalendarItem[ 'id' ];
type CalendarItemType = Exclude<
	ItemSummary[ 'type' ],
	'comment' | 'external-event'
>;

export const useItem = (
	type: ItemSummary[ 'type' ],
	id: ItemSummary[ 'id' ]
): Maybe< CalendarItem > =>
	useSelect( ( select ): Maybe< CalendarItem > => {
		switch ( type ) {
			case 'post':
				return select( NC_DATA ).getPost( id as PostId );

			case 'social':
				return select( NC_DATA ).getSocialMessage( id as Uuid );

			case 'task':
				return select( NC_DATA ).getTask( id as Uuid );

			case 'external-event':
			case 'internal-event':
				return undefined;

			default:
				return select( NC_DATA ).getPremiumItem(
					type,
					id as PremiumItem[ 'id' ]
				);
		} //end switch
	} );

export const useDraggingItem = (): Maybe< DraggableItemSummary > =>
	useSelect( ( select ) => select( NC_CALENDAR ).getDraggingItem() );

export const useHoverItem = (): Maybe< ItemSummary > =>
	useSelect( ( select ) => select( NC_CALENDAR ).getHoverItem() );

export const useDefaultTime = ( type: 'post' | 'social' ): string =>
	useSelect( ( select ) => select( NC_DATA ).getDefaultTime( type ) );

export const useDayType = (
	day: string
): 'past-day' | 'today' | 'future-day' =>
	useSelect( ( select ) => {
		const today = select( NC_DATA ).getToday();
		if ( day < today ) {
			return 'past-day';
		} else if ( day === today ) {
			return 'today';
		}
		return 'future-day';
		//end if
	} );

// TODO. Refactor this to unify collapse behavior.
export const useDayCollapser = (
	day: string
): [ boolean, ( areMessagesCollapsed: boolean ) => void ] => {
	const isCollapsed = useSelect( ( select ) =>
		select( NC_CALENDAR ).areSocialMessagesCollapsedInDay( day )
	);

	const { collapseSocialMessagesInDay } = useDispatch( NC_CALENDAR );
	const collapse = ( areMessagesCollapsed: boolean ) =>
		collapseSocialMessagesInDay( areMessagesCollapsed, day );

	return [ isCollapsed, collapse ];
};

// TODO. Refactor this to unify collapse behavior.
export const useCollapsableItemCount = ( day: string ): number => {
	const items = useVisibleDayItems( day );
	return useSelect( ( select ) => {
		const { getNumberOfNonCollapsableMessages } = select( NC_CALENDAR );
		const messages = filter( items, { type: 'social' } );
		const numToKeep = getNumberOfNonCollapsableMessages();
		return Math.max( 0, messages.length - numToKeep );
	} );
};

// TODO. Refactor this to unify collapse behavior.
export const useNonCollapsedDayItems = (
	day: string
): ReadonlyArray< ItemSummary > => {
	const items = useVisibleDayItems( day );
	const dayType = useDayType( day );
	const numToDrop = useCollapsableItemCount( day );

	return useSelect( ( select ) => {
		const { areSocialMessagesCollapsedInDay } = select( NC_CALENDAR );
		if ( ! areSocialMessagesCollapsedInDay( day ) ) {
			return items;
		} //end if

		const messages = filter( items, isMessageSummary );
		const numToKeep = messages.length - numToDrop;
		if ( ! numToDrop ) {
			return items;
		} //end if

		const { getSocialMessage } = select( NC_DATA );
		const collapsable = filter(
			messages,
			( { id } ) =>
				'past-day' !== dayType || !! getSocialMessage( id )?.sent
		);
		const collapsed = map( drop( collapsable, numToKeep ), 'id' );

		return filter(
			items,
			( { id, type } ) => 'social' !== type || ! collapsed.includes( id )
		);
	} );
};

export const useItemHoverListeners = (
	type: CalendarItemType,
	id: CalendarItemId
): {
	readonly onMouseEnter: () => void;
	readonly onMouseLeave: () => void;
} => {
	const item = useItem( type, id );

	if ( ! item ) {
		return NO_HOVER_LISTENERS;
	} //end if

	if ( 'post' === type && ! hasDate( item ) ) {
		return NO_HOVER_LISTENERS;
	} //end if

	const summary = isFreeItemType( type )
		? createItemSummary( type, item as FreeItem )
		: createPremiumItemSummary( type, item as PremiumItem );

	if ( ! summary ) {
		return NO_HOVER_LISTENERS;
	} //end if

	return {
		onMouseEnter: () => setHoverItemDebounced( summary ),
		onMouseLeave: () => setHoverItemDebounced(),
	};
};

export const useItemDragTriggers = (
	item: Maybe< DraggableItemSummary >
): {
	readonly onDragStart: () => void;
	readonly onDragEnd: () => void;
} => {
	const { dragEnd, dragStart } = useDispatch( NC_CALENDAR );
	if ( ! item ) {
		return NO_DRAG_TRIGGERS;
	} //end if

	return {
		onDragStart: () => void dragStart( item ),
		onDragEnd: () => void dragEnd(),
	};
};

export const usePostStatus = (
	postType: Maybe< PostTypeName >,
	status: Maybe< PostStatusSlug >
): Maybe< PostStatus > =>
	useSelect( ( select ): Maybe< PostStatus > => {
		select( NC_DATA );
		if ( ! postType || ! status ) {
			return undefined;
		} //end if
		const statuses = select( NC_DATA ).getPostStatuses( postType );
		return find( statuses, { slug: status } );
	} );

export const useNewPostLabel = (): string =>
	useSelect( ( select ) => {
		const newPostLabel = _x( 'Add New Post', 'command', 'nelio-content' );

		const { getPostTypes } = select( NC_DATA );
		const postTypes = getPostTypes( 'calendar' );
		if ( 1 === postTypes.length && postTypes[ 0 ] ) {
			return postTypes[ 0 ].labels.new || newPostLabel;
		} //end if

		return newPostLabel;
	} );

export const useCanCreatePosts = (): boolean =>
	useSelect( ( select ) => select( NC_DATA ).canCurrentUserCreatePosts() );

export const useCanCreateMessages = (): boolean =>
	useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserCreateMessagesAlways()
	);

export const useCanCreateTasks = (): boolean =>
	useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserCreateTasksAlways()
	);

export const usePostCreator = ( day: string, hour: string ): ( () => void ) => {
	const { openNewPostEditor } = useDispatch( NC_POST_EDITOR );
	return () =>
		openNewPostEditor( 'calendar', { dateValue: day, timeValue: hour } );
};

export const useMessageCreator = (
	day: string,
	hour: string
): ( () => void ) => {
	const isToday = day === useToday();

	const canCreate = useCanCreateMessages();
	const guard = useFeatureGuard( 'calendar/create-messages', canCreate );
	const { openNewSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );
	return guard( () =>
		openNewSocialMessageEditor(
			{
				dateType: isToday ? 'predefined-offset' : 'exact',
				dateValue: isToday ? '0' : day,
				timeType: isToday ? 'predefined-offset' : 'exact',
				timeValue: isToday ? '0' : hour,
			},
			{ context: 'calendar' }
		)
	);
};

export const useTaskCreator = ( day: string ): ( () => void ) => {
	const canCreate = useCanCreateTasks();
	const guard = useFeatureGuard( 'calendar/create-tasks', canCreate );
	const { openNewTaskEditor } = useDispatch( NC_TASK_EDITOR );
	return guard( () =>
		openNewTaskEditor(
			{
				dateType: 'exact',
				dateValue: day,
			},
			{
				post: undefined,
				context: 'calendar',
			}
		)
	);
};

export const useToday = (): string =>
	useSelect( ( select ) => select( NC_DATA ).getToday() );

export const useItemDropper = (
	day: string,
	hour?: number
): ( < T extends DraggableItemSummary >( item: T ) => T ) => {
	const {
		dragEnd,
		reschedulePost,
		rescheduleSocialMessage,
		requestRecurringRescheduleMode,
		rescheduleTask,
	} = useDispatch( NC_CALENDAR );

	const reusableGuard = useFeatureGuard(
		'calendar/schedule-reusable-messages'
	);

	const onDrop = ( summary: DraggableItemSummary ) => {
		if ( summary.type === 'reusable-message' ) {
			return reusableGuard( () =>
				createReusableMessage( summary.id, day, hour )
			)();
		} //end if

		const { id, type } = summary;
		const item = doSelect( NC_DATA ).getItem( type, id );
		if ( ! item ) {
			return;
		} //end if

		const newLocalHour = !! hour
			? getNewLocalHour( type, item as CalendarItem, hour )
			: undefined;
		switch ( type ) {
			case 'post':
				return reschedulePost( id, day, newLocalHour );
			case 'social': {
				const m = doSelect( NC_DATA ).getSocialMessage( id );
				return isRecurringMessage( m ) && ! isRecurringSource( m )
					? requestRecurringRescheduleMode( {
							id,
							day,
							hour: newLocalHour,
					  } )
					: rescheduleSocialMessage( id, day, newLocalHour );
			} //end case
			case 'task':
				return rescheduleTask( id, day );
		} //end switch
	};

	return < T extends DraggableItemSummary >( item: T ): T => {
		void dragEnd();
		void onDrop( item );
		return item;
	};
};

export const useMinRowHeight = (): number =>
	useSelect( ( select ) => select( NC_CALENDAR ).getMinimumRowHeight() );

export const useFirstDay = (): string =>
	useSelect( ( select ) => {
		const firstDayOfWeek = select( NC_DATA ).getFirstDayOfWeek();
		return select( NC_CALENDAR ).getFirstDay( firstDayOfWeek );
	} );

export const useNumberOfVisibleDays = (): number =>
	useSelect( ( select ) => select( NC_CALENDAR ).getNumberOfVisibleDays() );

export const useSidePane = (): CalendarPane | 'subscribe-banner' => {
	const shouldShowSubscribeBanner = useShouldShowSubscribeBanner();
	return useSelect( ( select ): CalendarPane | 'subscribe-banner' => {
		const { getDraggingItem, getSidePane } = select( NC_CALENDAR );
		const draggingItem = getDraggingItem();
		const sidePane = getSidePane();

		if ( sidePane !== 'none' ) {
			switch ( draggingItem?.type ) {
				case 'post':
					return 'unscheduled-posts';
				case 'reusable-message':
					return 'reusable-messages';
			} //end switch
		} //end if

		if ( 'none' === sidePane && shouldShowSubscribeBanner ) {
			return 'subscribe-banner';
		} //end if

		return sidePane;
	} );
};

// =======
// HELPERS
// =======

const NO_HOVER_LISTENERS = {
	onMouseEnter: () => void null,
	onMouseLeave: () => void null,
};

const setHoverItemDebounced = debounce(
	dispatch( NC_CALENDAR ).setHoverItem,
	200
);

const useVisibleDayItems = ( day: string ) =>
	useSelect( ( select ) => {
		const { getItem, getItemsInDay } = select( NC_DATA );
		const { isItemVisible } = select( NC_CALENDAR );
		return filter( getItemsInDay( day ), ( { id, type } ) => {
			const item = getItem( type, id );
			return !! item && isItemVisible( type, item );
		} );
	} );

function getNewLocalHour(
	type: CalendarItemType,
	item: CalendarItem,
	segmentHour: number
) {
	if ( type === 'task' ) {
		return '';
	} //end if

	const dtv = extractDateTimeValues(
		type === 'post'
			? ( item as Post ).date
			: ( item as SocialMessage ).schedule
	);
	if ( ! dtv ) {
		return '';
	} //end if

	const { timeValue } = dtv;
	const oldHour = Number.parseInt( timeValue.substring( 0, 2 ) );
	const oldMin = Number.parseInt( timeValue.substring( 3, 5 ) );
	const newLocalHour = ( oldHour % 4 ) + segmentHour;
	return (
		padStart( `${ newLocalHour }`, 2, '0' ) +
		':' +
		padStart( `${ oldMin }`, 2, '0' )
	);
} //end getNewLocalHour()

const isMessageSummary = ( i: ItemSummary ): i is SocialMessageSummary =>
	i.type === 'social';

const hasDate = ( i: Dict ): i is { date: string } => !! i.date;

const NO_DRAG_TRIGGERS = {
	onDragStart: () => void null,
	onDragEnd: () => void null,
};

async function createReusableMessage(
	id: ReusableSocialMessageId,
	day: string,
	hour?: number
) {
	const template = doSelect( NC_DATA ).getReusableMessage( id );
	if ( ! template ) {
		return;
	} //end if

	const datetime: Pick<
		SocialMessage,
		'dateType' | 'dateValue' | 'timeType' | 'timeValue'
	> = {
		dateType: 'exact',
		dateValue: day,
		timeType: 'exact',
		timeValue:
			'exact' === template.timeType
				? template.timeValue
				: getTime( template.timeValue, hour ),
	};

	const message: SocialMessage = {
		...createSocialMessage(),
		...template,
		...datetime,
		id: uuid(),
		schedule: getSocialMessageSchedule( {
			baseDatetime: 'now',
			...datetime,
		} ),
	};

	const summary = createItemSummary( 'social', message );
	await dispatch( NC_DATA ).receiveSocialMessages( message );
	await dispatch( NC_CALENDAR ).markAsUpdating( summary );

	try {
		const siteId = doSelect( NC_DATA ).getSiteId();
		const apiRoot = doSelect( NC_DATA ).getApiRoot();
		const token = doSelect( NC_DATA ).getAuthenticationToken();
		const timezone = doSelect( NC_DATA ).getSiteTimezone();

		const response = await apiFetch< ReadonlyArray< SocialMessage > >( {
			url: `${ apiRoot }/site/${ siteId }/social`,
			method: 'POST',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data: {
				...message,
				baseDatetime: 'now',
				timezone,
				slots: [
					{
						id: message.id,
						profileId: message.profileId,
						targetName: message.targetName ?? 'default',
						network: message.network,
						type: message.type,
					},
				],
			},
		} );
		await dispatch( NC_DATA ).receiveSocialMessages( response );
	} catch ( e ) {
		await dispatch( NC_DATA ).removeSocialMessage( message.id );
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_CALENDAR ).markAsUpdated( summary );
} //end createReusableMessage()

function getTime( timeInterval: string, hour?: number ): string {
	const pad = ( n: number ) => ( n < 10 ? `0${ n }` : n );
	const minute = pad( Math.floor( 60 * Math.random() ) );
	if ( hour ) {
		return `${ pad( hour ) }:${ minute }`;
	} //end if

	hour = Math.floor( 4 * Math.random() );
	switch ( timeInterval ) {
		case 'morning':
			return `${ pad( hour + 8 ) }:${ minute }`;
		case 'noon':
			return `${ pad( hour + 12 ) }:${ minute }`;
		case 'afternoon':
			return `${ pad( hour + 16 ) }:${ minute }`;
		case 'night':
			return `${ pad( hour + 20 ) }:${ minute }`;
		default:
			return `10:${ minute }`;
	} //end switch
} //end getTime()

const MIN_CALENDAR_WIDTH = 1200;
const useShouldShowSubscribeBanner = () =>
	useSelect(
		( select ) =>
			! select( NC_DATA ).isSubscribed() &&
			MIN_CALENDAR_WIDTH <= select( NC_CALENDAR ).getCalendarWidth()
	);
