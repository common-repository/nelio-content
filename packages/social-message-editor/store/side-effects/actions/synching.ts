/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';
import { addQueryArgs } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { mapValues, min } from 'lodash';
import { v4 as uuid } from 'uuid';
import { store as NC_DATA } from '@nelio-content/data';
import {
	doesNetworkSupport,
	getCharLimitInNetwork,
	getMinCharLimit,
} from '@nelio-content/networks';
import {
	computeSocialMessageText,
	getBaseDatetime,
	getSocialMessageSchedule,
	hasHead,
	isEmpty,
	setValue,
	showErrorNotice,
} from '@nelio-content/utils';
import type {
	Maybe,
	ReusableSocialMessage,
	SavingSocialMessage,
	SocialMessage,
	SocialNetworkName,
	SocialProfile,
	SocialTargetName,
	Url,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../../../store';

export async function sendNow(): Promise< void > {
	const messageId = select( NC_SOCIAL_EDITOR ).getId();
	if ( ! messageId ) {
		return;
	} //end if

	const status = select( NC_SOCIAL_EDITOR ).getStatus();
	if ( 'error' !== status ) {
		return;
	} //end if

	const isSaving = select( NC_SOCIAL_EDITOR ).isSaving();
	if ( isSaving ) {
		return;
	} //end if
	await dispatch( NC_SOCIAL_EDITOR ).markAsSaving( true );

	try {
		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		const message = await apiFetch< SocialMessage >( {
			url: `${ apiRoot }/site/${ siteId }/social/${ messageId }/retry`,
			method: 'PUT',
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		} );

		await dispatch( NC_DATA ).receiveSocialMessages( {
			...message,
			status: 'publish',
		} );
	} catch ( e ) {
		await showErrorNotice( e );
	} //end catch

	await dispatch( NC_SOCIAL_EDITOR ).markAsSaving( false );
	await dispatch( NC_SOCIAL_EDITOR ).close();
} //end sendNow()

export async function saveAndClose(
	removeRecurrence?: 'removing-recurrence'
): Promise< void > {
	const isSaving = select( NC_SOCIAL_EDITOR ).isSaving();
	if ( isSaving ) {
		return;
	} //end if
	await dispatch( NC_SOCIAL_EDITOR ).markAsSaving( true );

	try {
		const messageId = select( NC_SOCIAL_EDITOR ).getId();
		const message = getMessageAttributes();

		const hasRecurrenceSettings =
			! removeRecurrence &&
			select( NC_SOCIAL_EDITOR ).isRecurrenceEnabled();
		const recurrenceSettings = hasRecurrenceSettings
			? select( NC_SOCIAL_EDITOR ).getRecurrenceSettings()
			: undefined;

		const siteId = select( NC_DATA ).getSiteId();
		const apiRoot = select( NC_DATA ).getApiRoot();
		const token = select( NC_DATA ).getAuthenticationToken();

		const method = messageId ? 'PUT' : 'POST';
		const url = messageId
			? `${ apiRoot }/site/${ siteId }/social/${ messageId }`
			: `${ apiRoot }/site/${ siteId }/social`;

		const slots = await getSlots();
		const data = messageId
			? { ...message, ...slots[ 0 ], id: messageId, recurrenceSettings }
			: { ...message, slots, recurrenceSettings };

		const result = await apiFetch<
			ReadonlyArray< SocialMessage > | SocialMessage
		>( {
			url,
			method,
			credentials: 'omit',
			mode: 'cors',
			headers: {
				Authorization: `Bearer ${ token }`,
			},
			data,
		} );

		await dispatch( NC_DATA ).removeRecurringMessages(
			select( NC_DATA ).getSocialMessage( messageId )?.recurrenceGroup
		);
		await dispatch( NC_DATA ).receiveSocialMessages( result );

		await saveDefaultTime( message );
	} catch ( e ) {
		console.error( e ); // eslint-disable-line
	} //end catch

	await dispatch( NC_SOCIAL_EDITOR ).markAsSaving( false );
	await dispatch( NC_SOCIAL_EDITOR ).close();
} //end saveAndClose()

export async function saveReusableAndClose(): Promise< void > {
	const isSaving = select( NC_SOCIAL_EDITOR ).isSaving();
	if ( isSaving ) {
		return;
	} //end if
	await dispatch( NC_SOCIAL_EDITOR ).markAsSaving( true );

	try {
		const slots = await getSlots();
		const attrs = getMessageAttributes();
		const messageId = select( NC_SOCIAL_EDITOR ).getReusableMessageId();
		const defaultTime = select( NC_DATA ).getDefaultTime( 'social' );

		const message: Omit< ReusableSocialMessage, 'id' > = {
			...slots[ 0 ],
			...attrs,
			targetName:
				'default' !== slots[ 0 ].targetName
					? slots[ 0 ].targetName
					: undefined,
			timeType:
				attrs.timeType === 'exact' || attrs.timeType === 'time-interval'
					? attrs.timeType
					: 'exact',
			timeValue:
				attrs.timeType === 'exact' || attrs.timeType === 'time-interval'
					? attrs.timeValue
					: defaultTime,
		};

		const result = await apiFetch< ReusableSocialMessage >( {
			path: '/nelio-content/v1/reusable-message',
			method: 'POST',
			data: { message: { ...message, id: messageId } },
		} );

		await dispatch( NC_DATA ).receiveReusableMessages( result );
		await saveDefaultTime( message );
	} catch ( e ) {
		console.error( e ); // eslint-disable-line
	} //end catch

	await dispatch( NC_SOCIAL_EDITOR ).markAsSaving( false );
	await dispatch( NC_SOCIAL_EDITOR ).close();
} //end saveReusableAndClose()

// =======
// HELPERS
// =======

async function saveDefaultTime( {
	timeType,
	timeValue,
}: Pick< SocialMessage, 'timeType' | 'timeValue' > ) {
	if ( timeType !== 'exact' ) {
		return;
	} //end if
	await dispatch( NC_DATA ).setDefaultTime( 'social', timeValue );
	setValue( 'defaultSocialTime', timeValue );
} //end saveDefaultTime()

function getMessageAttributes(): SavingSocialMessage {
	// Attributes from editor NC_SOCIAL_EDITOR.
	const post = select( NC_SOCIAL_EDITOR ).getPost();
	const dateType = select( NC_SOCIAL_EDITOR ).getDateType();
	const dateValue = select( NC_SOCIAL_EDITOR ).getDateValue();
	const timeType = select( NC_SOCIAL_EDITOR ).getTimeType();
	const timeValue = select( NC_SOCIAL_EDITOR ).getTimeValue();
	const text = select( NC_SOCIAL_EDITOR ).getText();
	const image = select( NC_SOCIAL_EDITOR ).getImageUrl();
	const imageId = select( NC_SOCIAL_EDITOR ).getImageId();
	const video = select( NC_SOCIAL_EDITOR ).getVideoUrl();
	const videoId = select( NC_SOCIAL_EDITOR ).getVideoId();

	const networks = select( NC_SOCIAL_EDITOR ).getSelectedSocialNetworks();
	const limit =
		min( networks.map( getCharLimitInNetwork ) ) || getMinCharLimit();

	// Generic attributes.
	const timezone = select( NC_DATA ).getSiteTimezone();

	// Derived attributes.
	const baseDatetime = getBaseDatetime( post, dateType );
	const schedule = getSocialMessageSchedule( {
		baseDatetime,
		dateValue,
		timeType,
		timeValue,
	} );
	const textComputed = computeSocialMessageText(
		limit,
		post ? { ...post, permalink: '{permalink}' as Url } : undefined,
		text
	);

	return {
		baseDatetime,
		dateType,
		dateValue,
		image,
		imageId,
		postAuthor: post ? post.author : undefined,
		postId: post ? post.id : undefined,
		postType: post ? post.type : undefined,
		schedule,
		source: 'manual',
		text,
		textComputed,
		timeType,
		timeValue,
		timezone,
		video,
		videoId,
	};
} //end getMessageAttributes()

type Slot = {
	readonly id: Uuid;
	readonly profileId: Uuid;
	readonly targetName: SocialTargetName | 'default';
	readonly network: SocialNetworkName;
	readonly permalink: Maybe< Url >;
	readonly title?: string;
	readonly content?: string;
	readonly targetDisplayName?: string;
	readonly type: SocialMessage[ 'type' ];
};

async function getSlots(): Promise< Readonly< [ Slot, ...Slot[] ] > > {
	const profileIds = select( NC_SOCIAL_EDITOR ).getSelectedSocialProfiles();
	const slots: Slot[] = [];

	const post = select( NC_SOCIAL_EDITOR ).getPost();
	const postArgs = ( post?.permalinkQueryArgs ?? [] ).reduce(
		( r, [ k, v ] ) => ( { ...r, [ k ]: v } ),
		{}
	);
	const postUrls = post
		? {
				default: addQueryArgs( post.permalink, postArgs ) as Url,
				...mapValues(
					post.permalinks,
					( url ) => addQueryArgs( url ?? '', postArgs ) as Url
				),
		  }
		: undefined;

	for ( const profileId of profileIds ) {
		const profile = select( NC_DATA ).getSocialProfile( profileId );
		if ( ! profile ) {
			continue;
		} //end if

		const messageType = select( NC_SOCIAL_EDITOR ).getMessageTypeInNetwork(
			profile.network
		);
		if ( ! isMultiTarget( profile ) ) {
			slots.push( {
				id: uuid(),
				profileId,
				targetName: 'default',
				network: profile.network,
				permalink: postUrls?.[ profile.network ] ?? postUrls?.default,
				type: messageType,
				...( profile.network === 'medium' && {
					title: post?.title,
					content: post?.content,
				} ),
			} );
			continue;
		} //end if

		const targetNames =
			select( NC_SOCIAL_EDITOR ).getSelectedTargetsInProfile( profileId );

		if ( isEmpty( targetNames ) ) {
			continue;
		} //end if

		const targets =
			await resolveSelect( NC_DATA ).getTargetsInProfile( profileId );
		( targets ?? [] )
			.filter( ( { name } ) => targetNames.includes( name ) )
			.forEach( ( target ) =>
				slots.push( {
					id: uuid(),
					network: profile.network,
					profileId,
					targetDisplayName: target.displayName,
					targetName: target.name,
					permalink:
						postUrls?.[ profile.network ] ?? postUrls?.default,
					type: messageType,
				} )
			);
	} //end for

	if ( ! hasHead( slots ) ) {
		throw new Error( 'Unable to create slots!' );
	} //end if

	return slots;
} //end getSlots()

function isMultiTarget( { network }: SocialProfile ) {
	return doesNetworkSupport( 'multi-target', network );
} //end isMultiTarget()
