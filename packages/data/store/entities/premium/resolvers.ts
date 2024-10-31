/**
 * WordPress dependencies
 */
import { applyFilters } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import type { Maybe, PostId, PremiumItemType } from '@nelio-content/types';

export async function getAllPremiumItemsRelatedToPost(
	postId: Maybe< PostId >
): Promise< void > {
	await loadPremiumItemsRelatedToPost( postId );
} //end getAllPremiumItemsRelatedToPost()

export async function getPremiumItemsRelatedToPost(
	_: PremiumItemType,
	postId: Maybe< PostId >
): Promise< void > {
	await getAllPremiumItemsRelatedToPost( postId );
} //end getPremiumItemsRelatedToPost()

// =======
// HELPERS
// =======

async function loadPremiumItemsRelatedToPost(
	postId: Maybe< PostId >
): Promise< void > {
	if ( ! postId ) {
		return;
	} //end if
	await Promise.all(
		applyFilters(
			'nelio-content_data_loadPremiumItemsRelatedToPost',
			[ new Promise< void >( ( r ) => r() ) ],
			postId
		) as Promise< unknown >[]
	);
} //end loadPremiumItemsRelatedToPost()
