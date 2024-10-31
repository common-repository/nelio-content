/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect, useState } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { head, last } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import {
	computeSocialMessageText,
	getAllUrls,
	getBaseDatetime,
	getSocialMessageSchedule,
} from '@nelio-content/utils';
import type {
	Maybe,
	Post,
	SharedLink,
	SharedLinkStatus,
	SocialMessage,
	SocialProfile,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';
import { useRelatedPost } from './post';
import { useMaxChars } from './text';

export const usePreview = (): [ boolean, ( v: boolean ) => void ] => {
	const isVisible = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).isPreviewVisible()
	);
	const { showPreview } = useDispatch( NC_SOCIAL_EDITOR );
	return [ isVisible, showPreview ];
};

export const usePreviewAttributes = (): Omit<
	PreviewAttributes,
	'activeProfile'
> &
	Pick< Partial< PreviewAttributes >, 'activeProfile' > => {
	const limit = useMaxChars();
	return useSelect( ( select ) => {
		const { getSocialProfile } = select( NC_DATA );
		const {
			getActiveSocialNetwork,
			getActiveSocialProfile,
			getDateType,
			getDateValue,
			getImageUrl,
			getPost,
			getText,
			getTimeType,
			getTimeValue,
			getMessageTypeInNetwork,
		} = select( NC_SOCIAL_EDITOR );

		const activeNetwork = getActiveSocialNetwork();
		const activeProfileId = getActiveSocialProfile();
		const schedule = getSocialMessageSchedule( {
			baseDatetime: getBaseDatetime( getPost(), getDateType() ),
			dateValue: getDateValue(),
			timeType: getTimeType(),
			timeValue: getTimeValue(),
		} );

		return {
			activeProfile: activeProfileId
				? getSocialProfile( activeProfileId )
				: undefined,
			dateValue: getDateValue(),
			image: getImageUrl(),
			postId: getPost()?.id,
			schedule,
			textComputed: computeSocialMessageText(
				limit,
				getPost(),
				getText()
			),
			timeValue: getTimeValue(),
			type: getMessageTypeInNetwork( activeNetwork ),
		};
	} );
};

export const useSharedLinkAttributes = (
	linkPosition: 'first' | 'last'
): {
	readonly sharedLinkStatus: 'no-url' | SharedLinkStatus;
	readonly sharedLink?: SharedLink;
} => {
	const url = useRelevantLink( linkPosition );
	const [ post ] = useRelatedPost();

	const isPostUrl = !! post && areUrlsEqual( url, post?.permalink );

	const extLinkStatus = useSelect(
		( select ) =>
			url && ! isPostUrl
				? select( NC_DATA ).getSharedLinkStatus( url )
				: undefined,
		[ url, isPostUrl ]
	);
	const extLinkData = useSelect(
		( select ) =>
			url && ! isPostUrl
				? select( NC_DATA ).getSharedLinkData( url )
				: undefined,
		[ url, isPostUrl ]
	);

	if ( ! url ) {
		return {
			sharedLinkStatus: 'no-url',
		};
	} //end if

	if ( isPostUrl ) {
		return {
			sharedLinkStatus: 'ready',
			sharedLink: postToSharedLink( post ),
		};
	} //end if

	return {
		sharedLinkStatus: extLinkStatus || 'loading',
		sharedLink: extLinkData,
	};
};

export const useSharedLinkLoaderEffect = (
	urls: ReadonlyArray< Url >
): void => {
	const [ timeoutId, setTimeoutId ] =
		useState< ReturnType< typeof setTimeout > >();
	const { loadLink } = useDispatch( NC_DATA );
	const [ post ] = useRelatedPost();

	useEffect( () => {
		clearTimeout( timeoutId );
		setTimeoutId(
			setTimeout(
				() =>
					urls
						.filter(
							( url ) =>
								! post?.permalink ||
								! areUrlsEqual( url, post?.permalink )
						)
						.forEach( ( url ) => void loadLink( url ) ),
				1000
			)
		);
	}, [ urls.join( '; ' ) ] );
};

// =====
// TYPES
// =====

export type PreviewAttributes = Pick<
	SocialMessage,
	| 'dateValue'
	| 'image'
	| 'postId'
	| 'schedule'
	| 'textComputed'
	| 'timeValue'
	| 'type'
> & {
	readonly activeProfile: SocialProfile;
};

// =======
// HELPERS
// =======

const useRelevantLink = ( linkPosition: 'first' | 'last' ) => {
	const limit = useMaxChars();
	return useSelect( ( select ): Maybe< Url > => {
		const { getPost, getText } = select( NC_SOCIAL_EDITOR );

		const post = getPost();
		const textComputed = computeSocialMessageText( limit, post, getText() );
		const urls = getAllUrls( textComputed );
		return 'first' === linkPosition ? head( urls ) : last( urls );
	} );
};

const postToSharedLink = ( post: Post ): SharedLink => ( {
	author: post.authorName,
	date: post.date || '',
	domain: ( post.permalink || '' )
		.replace( /^https?:\/\//, '' )
		.replace( /\/.*$/, '' ),
	email: '',
	excerpt: post.excerpt,
	image: post.imageSrc || '',
	permalink: post.permalink,
	responseCode: 200,
	title: post.title,
	twitter: '',
} );

const areUrlsEqual = ( a: Maybe< Url >, b: Maybe< Url > ) =>
	!! a &&
	!! b &&
	a.replace( /^https?:\/\//, 'http://' ) ===
		b.replace( /^https?:\/\//, 'http://' );
