/**
 * WordPress dependencies
 */
import { select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import moment from 'moment';
import { keys, map, padStart } from 'lodash';
import { make } from 'ts-brand';
import { v4 as uuid } from 'uuid';
import { format } from '@nelio-content/date';
import type {
	EditorialComment,
	EditorialTask,
	EditorialTaskSummary,
	ExportedSocialTemplate,
	ExternalEvent,
	ExternalEventSummary,
	InternalEvent,
	InternalEventSummary,
	FreeItem,
	FreeItemSummary,
	FreeItemType,
	NewPost,
	NewSocialMessage,
	Post,
	PostId,
	PostSummary,
	PostTypeContext,
	PostTypeName,
	RecurrenceContext,
	RegularAutomationGroupId,
	SocialMessage,
	SocialMessageSummary,
	SocialTemplate,
	Weekday,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { POST } from './branded-types';

// NOTE. Dependency loop with @nelio-content/data.
import type { store } from '@nelio-content/data';
const NC_DATA = 'nelio-content/data' as unknown as typeof store;

export const createRecurrenceContext = ( date: string ): RecurrenceContext => {
	const WEEKDAYS: ReadonlyArray< Weekday > = [
		'sun',
		'mon',
		'tue',
		'wed',
		'thu',
		'fri',
		'sat',
	];
	const monthday = Number.parseInt( date.substring( 8, 10 ) );

	const numericWeekday = Number.parseInt( format( 'N', date ) ) % 7;
	const weekday = WEEKDAYS[ numericWeekday ] || 'sun';

	const weekindex = (): RecurrenceContext[ 'weekindex' ] => {
		const month = date.substring( 0, 8 );
		const m = moment( month + '01' );
		const weekdays: string[] = [];

		while ( m.format( 'YYYY-MM-' ) === month ) {
			weekdays.push( m.format( 'ddd' ).toLowerCase() );
			m.add( 1, 'day' );
		} //end while

		const before = weekdays.slice( 0, monthday );
		const after = weekdays.slice( monthday );

		const aux = before.filter( ( d ) => d === weekday ).length;
		const bc = aux as 1 | 2 | 3 | 4 | 5;
		const ac = after.filter( ( d ) => d === weekday ).length;

		if ( ac || 5 === bc ) {
			return [ bc ];
		} //end if

		return [ 4, 5 ];
	};

	return { monthday, weekday, weekindex: weekindex() };
};

export function createPost( context: PostTypeContext ): NewPost {
	const { getCurrentUserId } = select( NC_DATA );
	return {
		author: getCurrentUserId(),
		title: '',
		dateValue: '',
		timeValue: '',
		type: getDefaultPostType( context ),
		taxonomies: {},
	};
} //end createPost()

export function createSocialMessage(): NewSocialMessage {
	return {
		dateType: 'predefined-offset',
		dateValue: '0',
		status: 'draft',
		source: 'manual',
		timeType: 'predefined-offset',
		timeValue: '0',
		text: '',
		textComputed: '',
		type: 'text',
	};
} //end createSocialMessage()

export function createAutomationGroupId(): RegularAutomationGroupId {
	return make< RegularAutomationGroupId >()( uuid() );
} //end createAutomationGroupId()
export function createSocialTemplate(
	attributes: Partial< Omit< SocialTemplate, 'id' | 'creatorId' > > &
		Pick< SocialTemplate, 'groupId' | 'text' | 'network' | 'postType' >
): SocialTemplate {
	const { getCurrentUserId } = select( NC_DATA );

	return {
		creatorId: getCurrentUserId(),
		id: uuid(),
		taxonomies: {},
		...attributes,
	};
} //end createSocialTemplate()

export function makeExportedTemplate(
	t: SocialTemplate
): ExportedSocialTemplate {
	return t.profileId
		? {
				isNetwork: false,
				targetName: t.targetName,
				text: t.text,
				...( t.author && { author: t.author } ),
				...( t.postType && { postType: t.postType } ),
				...( keys( t.taxonomies ).length && {
					taxonomies: t.taxonomies,
				} ),
				availability: t.availability,
		  }
		: {
				isNetwork: true,
				text: t.text,
				...( t.author && { author: t.author } ),
				...( t.postType && { postType: t.postType } ),
				...( keys( t.taxonomies ).length && {
					taxonomies: t.taxonomies,
				} ),
				availability: t.availability,
		  };
} //end makeExportedTemplate()

export function createTask(): EditorialTask {
	const { getCurrentUserId, getSiteTimezone } = select( NC_DATA );

	return {
		id: uuid(),
		assigneeId: getCurrentUserId(),
		assignerId: getCurrentUserId(),
		color: 'none',
		completed: false,
		dateDue: '',
		dateType: 'exact',
		dateValue: '',
		task: '',
		timezone: getSiteTimezone(),
	};
} //end createTask()

export function createComment(
	postId: PostId,
	postType: PostTypeName
): EditorialComment {
	const { getCurrentUserId, getSiteTimezone } = select( NC_DATA );

	return {
		id: uuid(),
		authorId: getCurrentUserId(),
		comment: '',
		date: new Date().toISOString(),
		postId,
		postType,
		timezone: getSiteTimezone(),
	};
} //end createComment()

export function createItemSummary( type: 'post', item: Post ): PostSummary;
export function createItemSummary(
	type: 'social',
	item: SocialMessage
): SocialMessageSummary;
export function createItemSummary(
	type: 'task',
	item: EditorialTask
): EditorialTaskSummary;
export function createItemSummary(
	type: 'external-event',
	item: ExternalEvent
): ExternalEventSummary;
export function createItemSummary(
	type: 'internal-event',
	item: InternalEvent
): InternalEventSummary;
export function createItemSummary(
	type: FreeItemType,
	item: FreeItem
): FreeItemSummary;
export function createItemSummary(
	type: FreeItemType,
	item: FreeItem
): FreeItemSummary {
	switch ( type ) {
		case 'post': {
			const post = item as Post;
			return {
				type,
				id: post.id,
				relatedPostId: post.id,
				day: day( post.date ),
				sort: getSortString( type, post ),
			};
		} //end case

		case 'external-event': {
			const event = item as ExternalEvent;
			return {
				type,
				id: event.id,
				day: day( event.date ),
				sort: getSortString( type, event ),
			};
		} //end case

		case 'internal-event': {
			const event = item as InternalEvent;
			return {
				type,
				id: event.id,
				day: day( event.date ),
				sort: getSortString( type, event ),
			};
		} //end case

		case 'task': {
			const task = item as EditorialTask;
			return {
				type,
				id: task.id,
				day: day( task.dateDue ),
				relatedPostId: task.postId,
				sort: getSortString( type, task ),
			};
		} //end case

		case 'social': {
			const message = item as SocialMessage;
			return {
				type,
				id: message.id,
				day: day( message.schedule ),
				relatedPostId: message.postId,
				recurrenceGroup: message.recurrenceGroup,
				sort: getSortString( type, message ),
			};
		} //end case
	} //end switch
} //end createItemSummary()

// =======
// HELPERS
// =======

function getDefaultPostType( context: PostTypeContext ): PostTypeName {
	const { getPostTypes } = select( NC_DATA );
	const postTypes = map( getPostTypes( context, 'create' ), 'name' );
	return ! postTypes[ 0 ] || postTypes.includes( POST )
		? POST
		: postTypes[ 0 ];
} //end getDefaultPostType()

export function getSortString( type: FreeItemType, item: FreeItem ): string {
	let result: string;
	result = isExternalEvent( item, type ) && item.isDayEvent ? 'a:' : 'b:';
	result += isEditorialTask( item, type ) ? 'a:' : 'b:';
	result += getDate( type, item );
	result += ':';
	result += 'post' === type ? 'a:' : 'b:';
	result +=
		isSocialMessage( item, type ) && 'twitter' === item.network
			? 'a:'
			: 'b:';

	result += isPost( item, type ) ? item.title : '';
	result += isSocialMessage( item, type ) ? item.textComputed : '';
	result += isEditorialTask( item, type ) ? item.task : '';
	result += `${ item.id }`;

	return result;
} //end getSortString()

function day( date: unknown ): string {
	if ( typeof date !== 'string' || ! date ) {
		return '0000-00-00';
	} //end if
	return format( 'Y-m-d', date );
} //end day()

function getDate( type: FreeItemType, item: FreeItem ): string {
	if ( isSocialMessage( item, type ) ) {
		return item.schedule || '';
	} //end if

	if ( isEditorialTask( item, type ) ) {
		if ( 'exact' === item.dateType ) {
			return `0:${ item.dateValue }`;
		} //end if
		const aux = Number.parseInt( item.dateValue ) || 0;
		const value = 'negative-days' === item.dateType ? -aux : aux;
		return '1:' + padStart( `${ 5555 + value }`, 5, '0' );
	} //end if

	return item.date || '';
} //end getDate()

const isExternalEvent = (
	item: FreeItem,
	type: FreeItemType
): item is ExternalEvent => !! item && 'external-event' === type;

const isPost = ( item: FreeItem, type: FreeItemType ): item is Post =>
	!! item && 'post' === type;

const isSocialMessage = (
	item: FreeItem,
	type: FreeItemType
): item is SocialMessage => !! item && 'social' === type;

const isEditorialTask = (
	item: FreeItem,
	type: FreeItemType
): item is EditorialTask => !! item && 'task' === type;
