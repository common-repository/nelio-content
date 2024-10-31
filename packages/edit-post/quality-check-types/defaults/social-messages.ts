/**
 * WordPress dependencies
 */
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { doesNetworkRequire } from '@nelio-content/networks';
import { isEmpty } from '@nelio-content/utils';
import type { Maybe, SocialProfile, PostTypeName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { registerQualityCheck } from '../api';
import { store as NC_EDIT_POST } from '../../store';

registerQualityCheck( 'nelio-content/social-messages', {
	icon: 'share',
	settings: {
		isNoProfilesBad: true,
		isAllProfilesEmptyBad: true,
		isSomeProfilesEmptyBad: false,
	},
	attributes: ( select ) => {
		const edit = select( NC_EDIT_POST );
		const data = select( NC_DATA );

		const sources = edit.getAutomationSources();
		const isAutoShareEnabled = edit.isAutoShareEnabled();
		const hasAutomationSources =
			edit.getContent().includes( '<ncshare>' ) ||
			sources.useCustomSentences;

		return {
			isEnabled: data
				.getPostTypes( 'social' )
				.map( ( x ): Maybe< PostTypeName > => x.name )
				.includes( edit.getPostType() ),
			isPostAutoShareable: isAutoShareEnabled && hasAutomationSources,
			isPublished: 'publish' === edit.getStatus(),
			hasImages:
				!! edit.getImages().length || !! edit.getFeaturedImageSrc(),
			messages: data.getSocialMessagesRelatedToPost( edit.getPostId() ),
			profiles: data.getSocialProfiles(),
		};
	},
	validate: (
		{
			isEnabled,
			isPostAutoShareable,
			isPublished,
			hasImages,
			messages,
			profiles,
		},
		{ isNoProfilesBad, isAllProfilesEmptyBad, isSomeProfilesEmptyBad }
	) => {
		if ( ! isEnabled ) {
			return { status: 'invisible', text: '' };
		} //end if

		if ( isPublished ) {
			return {
				status: 'good',
				text: _x(
					'Social messages look good',
					'text',
					'nelio-content'
				),
			};
		} //end if

		if ( isEmpty( profiles ) ) {
			return {
				status: isNoProfilesBad ? 'bad' : 'improvable',
				text: _x(
					'Connect some profiles to share this on social media',
					'user',
					'nelio-content'
				),
			};
		} //end if

		// Analyze only message statuses on “relevant” profiles.
		profiles = profiles.filter( isNotTikTok );
		if ( isEmpty( profiles ) ) {
			return {
				status: 'improvable',
				text: _x(
					'Connect non-TikTok profiles to promote this on social media',
					'user',
					'nelio-content'
				),
			};
		} //end if

		if ( isEmpty( messages ) ) {
			if (
				! isPostAutoShareable ||
				! profiles.every( ( p ) => !! p.publicationFrequency )
			) {
				return {
					status: isAllProfilesEmptyBad ? 'bad' : 'improvable',
					text: _x(
						'Schedule social messages on all profiles',
						'user',
						'nelio-content'
					),
				};
			} //end if

			if (
				! hasImages &&
				profiles.every( ( p ) =>
					doesNetworkRequire( 'image', p.network )
				)
			) {
				return {
					status: isAllProfilesEmptyBad ? 'bad' : 'improvable',
					text: _x(
						'Social messages can’t be auto-generated because all profiles require an image',
						'text',
						'nelio-content'
					),
				};
			} //end if

			if (
				! hasImages &&
				profiles.some( ( p ) =>
					doesNetworkRequire( 'image', p.network )
				)
			) {
				return {
					status: isSomeProfilesEmptyBad ? 'bad' : 'improvable',
					text: _x(
						'Some profiles require an image and their social messages can’t be auto-generated',
						'text',
						'nelio-content'
					),
				};
			} //end if

			return {
				status: 'good',
				text: _x(
					'Automatic social messages look good',
					'text',
					'nelio-content'
				),
			};
		} //end if

		const hasMessages = ( profile: SocialProfile ) =>
			messages.some( ( m ) => m.profileId === profile.id );
		if ( ! profiles.every( hasMessages ) ) {
			return {
				status: isSomeProfilesEmptyBad ? 'bad' : 'improvable',
				text: _x(
					'Schedule social messages on all profiles',
					'user',
					'nelio-content'
				),
			};
		} //end if

		return {
			status: 'good',
			text: _x( 'Social messages look good', 'text', 'nelio-content' ),
		};
	},
} );

// =======
// HELPERS
// =======

function isNotTikTok( p: SocialProfile ) {
	return p.network !== 'tiktok';
} //end isNotTikTok()
