/**
 * External dependencies.
 */
import { find, groupBy, map, mapValues, pick, values, without } from 'lodash';
import { isDefined } from '@nelio-content/utils';
import type {
	EditorialTaskSummary,
	PostId,
	PremiumItemSummary,
	SocialMessageSummary,
} from '@nelio-content/types';

type State< T > = Record< PostId, ReadonlyArray< T > >;

type ItemSummary =
	| EditorialTaskSummary
	| PremiumItemSummary
	| SocialMessageSummary;

export function groupByRelatedPost< TSummary extends ItemSummary >(
	state: State< TSummary >,
	items: ReadonlyArray< TSummary >
): State< TSummary > {
	items = items.filter( ( i ) => !! i.relatedPostId );
	if ( ! items.length ) {
		return state;
	} //end if

	// Remove old items.
	state = items.reduce( ( s, i ) => removeFromRelatedPost( s, i.id ), state );

	// Add new items.
	const postIds = map( items, ( i ) => i.relatedPostId ).filter( isDefined );
	const existingItems = values( pick( state, postIds ) ).flatMap(
		( i ) => i
	);

	return {
		...state,
		...groupBy( [ ...items, ...existingItems ], 'relatedPostId' ),
	};
} //end groupByRelatedPost()

export function removeFromRelatedPost< TSummary extends ItemSummary >(
	state: State< TSummary >,
	id: TSummary[ 'id' ]
): State< TSummary > {
	return mapValues( state, ( items ) => {
		const item = find( items, ( i ) => i.id === id );
		return item ? without( items, item ) : items;
	} );
} //end removeFromRelatedPost()
