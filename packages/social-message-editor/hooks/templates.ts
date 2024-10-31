/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import {
	flatten,
	filter,
	find,
	keyBy,
	keys,
	map,
	mapValues,
	values,
} from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import type { Maybe, Post, SocialTemplate } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export type PostTemplates = {
	readonly recommendedTemplates: ReadonlyArray< SocialTemplate >;
	readonly otherTemplates: ReadonlyArray< SocialTemplate >;
};

export const usePostTemplates = ( post: Maybe< Post > ): PostTemplates =>
	useSelect( ( select ): PostTemplates => {
		const {
			getSelectedSocialNetworks,
			getSelectedSocialProfiles,
			getSelectedTargetsInProfile,
		} = select( NC_SOCIAL_EDITOR );

		const profiles = getSelectedSocialProfiles();
		const networks = getSelectedSocialNetworks();
		const targets = flatten( map( profiles, getSelectedTargetsInProfile ) );

		const templates = select( NC_DATA ).getSocialTemplates( post );

		const recommended = keyBy(
			filter(
				templates,
				( t ) =>
					( !! post || ! hasPlaceholders( t.text ) ) &&
					impliesIn( t.profileId, profiles ) &&
					impliesIn( t.network, networks ) &&
					impliesIn( t.targetName, targets ) &&
					( ! post ||
						( ( ! t.author || t.author === post.author ) &&
							values(
								mapValues(
									post.taxonomies,
									( terms, tax ) =>
										! t.taxonomies[ tax ] ||
										!! find( terms, {
											id: t.taxonomies[ tax ],
										} )
								)
							).every( Boolean ) ) )
			),
			'text'
		);

		const excluded = keys( recommended );
		const others = keyBy(
			filter( templates, ( t ) => ! excluded.includes( t.text ) ),
			'text'
		);

		return {
			recommendedTemplates: values( recommended ),
			otherTemplates: values( others ),
		};
	} );

// =======
// HELPERS
// =======

const hasPlaceholders = ( text: string ) => text.includes( '{permalink}' );

const impliesIn = ( el: Maybe< string >, list: ReadonlyArray< string > ) =>
	! el || ! list.length || list.includes( el );
