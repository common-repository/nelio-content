/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch, resolveSelect, select } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import z from 'zod';
import { v4 as uuid } from 'uuid';
import { getCharLimitInNetwork } from '@nelio-content/networks';
import {
	computeSocialMessageText,
	getBaseDatetime,
	showErrorNotice,
} from '@nelio-content/utils';
import type {
	Maybe,
	MediaId,
	Post,
	PostId,
	SavingSocialMessage,
	SocialMessage,
	SocialNetworkName,
	SocialProfile,
	Url,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from '../../../store';

type NewSocialMessage = SavingSocialMessage & {
	slots: [
		{
			readonly id: Uuid;
			readonly profileId: Uuid;
			readonly targetName: string;
			readonly network: SocialNetworkName;
			readonly targetDisplayName?: string;
			readonly type: SocialMessage[ 'type' ];
		},
	];
};

/**
 * Creates a new social message using the provided attributes.
 *
 * @param message Object Message attributes.
 *
 * @return SocialMessage returns the new social message.
 *
 * @since 3.0.0
 */
export async function createSocialMessage(
	message: unknown
): Promise< SocialMessage > {
	const attrs = messageSchema.parse( message );
	const post = attrs.post
		? await resolveSelect( NC_DATA ).getPost( attrs.post )
		: undefined;

	const data: NewSocialMessage = {
		...getDatetimeProps( post, attrs.date, attrs.time ),
		image: 'imageUrl' in attrs ? attrs.imageUrl : undefined,
		imageId: 'imageId' in attrs ? attrs.imageId : undefined,
		postAuthor: post?.author,
		postId: post?.id,
		postType: post?.type,
		source: 'manual',
		text: attrs.text,
		textComputed: computeSocialMessageText(
			getCharLimitInNetwork( attrs.profile.network ),
			post,
			attrs.text
		),
		slots: [
			{
				id: uuid(),
				profileId: attrs.profile.id,
				network: attrs.profile.network,
				targetName: attrs.targetName ?? 'default',
				type: !! attrs.imageUrl ? 'image' : 'text',
			},
		],
	};

	const siteId = select( NC_DATA ).getSiteId();
	const apiRoot = select( NC_DATA ).getApiRoot();
	const token = select( NC_DATA ).getAuthenticationToken();

	const result = await apiFetch< [ SocialMessage ] >( {
		url: `${ apiRoot }/site/${ siteId }/social`,
		method: 'POST',
		credentials: 'omit',
		mode: 'cors',
		headers: {
			Authorization: `Bearer ${ token }`,
		},
		data,
	} );

	await dispatch( NC_DATA ).receiveSocialMessages( result );
	return result[ 0 ];
} //end createSocialMessage()

export async function resetSocialMessages(): Promise< void > {
	const status = select( NC_DATA ).getResetStatus();
	if ( 'ready' !== status ) {
		return;
	} //end if

	try {
		await dispatch( NC_DATA ).setResetStatus( 'resetting' );
		await apiFetch( {
			path: '/nelio-content/v1/social/reset',
			method: 'PUT',
		} );
		await dispatch( NC_DATA ).setResetStatus( 'done' );
	} catch ( e ) {
		await showErrorNotice( e );
		await dispatch( NC_DATA ).setResetStatus( 'error' );
	} //end catch
} //end resetSocialMessages()

// =======
// HELPERS
// =======

const messageSchema = z
	.object( {
		profile: z
			.string()
			.uuid()
			.transform( ( v ) =>
				select( NC_DATA ).getSocialProfile( v as Uuid )
			)
			.refine( ( p ): p is SocialProfile => !! p ),
		targetName: z.string().optional(),
		text: z.string().trim().min( 1 ),
		date: z.union( [
			z.number().nonnegative(),
			z.string().regex( /\d{4}-\d{2}-\d{2}/ ),
		] ),
		time: z.union( [
			z.number().nonnegative(),
			z.string().regex( /\d{2}:\d{2}/ ),
		] ),
		post: z
			.number()
			.optional()
			.transform( ( p ) => p as Maybe< PostId > ),
		imageUrl: z
			.string()
			.url()
			.optional()
			.transform( ( v ) => v as Maybe< Url > ),
		imageId: z
			.number()
			.optional()
			.transform( ( v ) => v as Maybe< MediaId > ),
	} )
	// IF time is number THEN date is 0
	.refine(
		( d ) => 'number' !== typeof d.time || 0 === d.date,
		'numeric time can only be set if date is 0'
	)
	// IF imageId THEN also imageUrl
	.refine( ( d ) => ! d.imageId || !! d.imageUrl, 'imageUrl is missing' );

const getDatetimeProps = (
	post: Maybe< Post >,
	date: string | number,
	time: string | number
) => {
	const dateType = 'number' === typeof date ? 'positive-days' : 'exact';
	const dateValue = `${ date }`;
	const timeType = 'number' === typeof date ? 'positive-hours' : 'exact';
	const timeValue = `${ time }`;
	return {
		baseDatetime: getBaseDatetime( post, dateType ),
		schedule: '', // TODO.
		dateType,
		dateValue,
		timeType,
		timeValue,
		timezone: select( NC_DATA ).getSiteTimezone(),
	} as const;
};
