/**
 * External dependencies
 */
import { map, mapValues } from 'lodash';
import { isDefined } from '@nelio-content/utils';
import type {
	Maybe,
	PostId,
	PremiumItems,
	PremiumItemSummaries,
	PremiumItemType,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State } from '../../config';

type GetPremiumItem = typeof _getPremiumItem & {
	CurriedSignature: < Type extends PremiumItemType >(
		type: Type,
		id?: PremiumItems[ Type ][ 'id' ]
	) => Maybe< PremiumItems[ Type ] >;
};
export const getPremiumItem: GetPremiumItem = _getPremiumItem as GetPremiumItem;
function _getPremiumItem< Type extends PremiumItemType >(
	state: State,
	type: Type,
	id?: PremiumItems[ Type ][ 'id' ]
): Maybe< PremiumItems[ Type ] > {
	return id ? state.entities.premiumByType[ type ]?.byId[ id ] : undefined;
} //end _getPremiumItem()

type GetAllPremiumItemsRelatedToPost =
	typeof _getAllPremiumItemsRelatedToPost & {
		CurriedSignature: ( postId?: PostId ) => Partial< {
			[ K in PremiumItemType ]: ReadonlyArray< PremiumItems[ K ] >;
		} >;
	};
export const getAllPremiumItemsRelatedToPost =
	_getAllPremiumItemsRelatedToPost as GetAllPremiumItemsRelatedToPost;
function _getAllPremiumItemsRelatedToPost(
	state: State,
	postId?: PostId
): Partial< { [ K in PremiumItemType ]: ReadonlyArray< PremiumItems[ K ] > } > {
	if ( ! postId ) {
		return {};
	} //end if

	const summariesByType = mapValues(
		state.entities.premiumByType,
		( s ) => s?.byRelatedPost[ postId ] ?? []
	);

	return mapValues(
		summariesByType,
		< K extends PremiumItemType >(
			summaries: ReadonlyArray< PremiumItemSummaries[ K ] >,
			type: K
		) =>
			map( summaries, ( { id } ) =>
				getPremiumItem( state, type, id )
			).filter( isDefined )
	) as Partial< {
		[ K in PremiumItemType ]: ReadonlyArray< PremiumItems[ K ] >;
	} >;
} //end _getAllPremiumItemsRelatedToPost()

type GetPremiumItemsRelatedToPost = typeof _getPremiumItemsRelatedToPost & {
	CurriedSignature: < Type extends PremiumItemType >(
		typeName: Type,
		postId?: PostId
	) => ReadonlyArray< PremiumItems[ Type ] >;
};
export const getPremiumItemsRelatedToPost =
	_getPremiumItemsRelatedToPost as GetPremiumItemsRelatedToPost;
function _getPremiumItemsRelatedToPost< Type extends PremiumItemType >(
	state: State,
	typeName: Type,
	postId?: PostId
): ReadonlyArray< PremiumItems[ Type ] > {
	const all = getAllPremiumItemsRelatedToPost( state, postId );
	return all[ typeName ] ?? [];
} //end _getPremiumItemsRelatedToPost()
