/**
 * External dependencies
 */
import { find, keys, isEqual, pick, some } from 'lodash';
import type {
	AuthorId,
	EditorialComment,
	EditorialTask,
	Maybe,
	PostId,
	PostStatusSlug,
	PostTypeName,
	PremiumItems,
	PremiumItemType,
	TaxonomySlug,
	Term,
	Url,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { EditorialReference, State } from '../types';

export function getAllAttributes( state: State ): State[ 'attributes' ] {
	return state.attributes;
} //end getAllAttributes()

export function getId( state: State ): Maybe< PostId > {
	return state.attributes.id;
} //end getId()

export function getTitle( state: State ): string {
	return state.attributes.title || '';
} //end getTitle()

export function getPostType( state: State ): Maybe< PostTypeName > {
	return state.attributes.type;
} //end getPostType()

export function getPostStatus( state: State ): Maybe< PostStatusSlug > {
	return state.attributes.status;
} //end getPostStatus()

export function getPostTerms(
	state: State,
	taxonomy: TaxonomySlug
): ReadonlyArray< Term > {
	return state.attributes.taxonomies[ taxonomy ] ?? [];
} //end getPostTerms()

export function getPostTermsByTaxonomy(
	state: State
): Record< TaxonomySlug, ReadonlyArray< Term > > {
	return state.attributes.taxonomies;
} //end getPostTermsByTaxonomy()

export function getAuthorId( state: State ): Maybe< AuthorId > {
	return state.attributes.authorId;
} //end getAuthorId()

export function getDateValue( state: State ): string {
	return state.attributes.dateValue;
} //end getDateValue()

export function getTimeValue( state: State ): string {
	return state.attributes.timeValue;
} //end getTimeValue()

export function getTasks( state: State ): ReadonlyArray< EditorialTask > {
	return state.attributes.tasks;
} //end getTasks()

type GetPremiumItems = typeof _getPremiumItems & {
	CurriedSignature: < Type extends PremiumItemType >(
		typeName: Type
	) => ReadonlyArray< PremiumItems[ Type ] >;
};
export const getPremiumItems: GetPremiumItems =
	_getPremiumItems as GetPremiumItems;
function _getPremiumItems< Type extends PremiumItemType >(
	state: State,
	typeName: Type
): ReadonlyArray< PremiumItems[ Type ] > {
	return state.attributes.premiumItemsByType[ typeName ] ?? [];
} //end _getPremiumItems()

type ArePremiumItemsDirty = typeof _arePremiumItemsDirty & {
	CurriedSignature: < Type extends PremiumItemType >(
		typeName: Type,
		oldPremiumItems: ReadonlyArray< PremiumItems[ Type ] >
	) => boolean;
};
export const arePremiumItemsDirty: ArePremiumItemsDirty =
	_arePremiumItemsDirty as ArePremiumItemsDirty;
function _arePremiumItemsDirty< Type extends PremiumItemType >(
	state: State,
	typeName: Type,
	oldPremiumItems: ReadonlyArray< PremiumItems[ Type ] >
): boolean {
	const premiumItems = getPremiumItems( state, typeName );
	return (
		premiumItems.length !== oldPremiumItems.length ||
		some( premiumItems, ( a ) => {
			const oa = find( oldPremiumItems, { id: a.id } );
			return ! oa || ! isEqual( pick( a, keys( oa ) ), oa );
		} )
	);
} //end _arePremiumItemsDirty()

type OldTask = Pick<
	EditorialTask,
	'id' | 'task' | 'dateType' | 'dateValue' | 'color' | 'assigneeId'
>;
export function areTasksDirty(
	state: State,
	oldTasks: ReadonlyArray< OldTask >
): boolean {
	const { tasks } = state.attributes;

	oldTasks = oldTasks.map( ( t ) =>
		pick( t, [
			'id',
			'task',
			'dateType',
			'dateValue',
			'color',
			'assigneeId',
		] )
	);

	return (
		tasks.length !== oldTasks.length ||
		some( tasks, ( t ) => {
			const ot = find( oldTasks, { id: t.id } );
			return ! ot || ! isEqual( pick( t, keys( ot ) ), ot );
		} )
	);
} //end areTasksDirty()

export function getReferenceInput( state: State ): string {
	return state.attributes.referenceInput;
} //end getReferenceInput()

export function getReferences(
	state: State
): ReadonlyArray< EditorialReference > {
	return state.attributes.references;
} //end getReferences()

export function getNewComments(
	state: State
): ReadonlyArray< EditorialComment > {
	return state.attributes.newComments;
} //end getNewComments()

type OldRef = { readonly url: Url };
export function areReferencesDirty(
	state: State,
	oldReferences: ReadonlyArray< OldRef >
): boolean {
	const oldRefs = oldReferences.map( ( r ) => r.url );
	const refs = state.attributes.references;
	return (
		oldRefs.length !== refs.length ||
		some( refs, ( r ) => ! oldRefs.includes( r.url ) )
	);
} //end areReferencesDirty()
