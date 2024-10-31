/**
 * External dependencies
 */
import type {
	AuthorId,
	EditorialComment,
	EditorialTask,
	PostStatusSlug,
	PostTypeName,
	PremiumItemType,
	TaxonomySlug,
	Term,
	PremiumItems,
} from '@nelio-content/types';

export type AttributeAction =
	| SetTitle
	| SetPostType
	| SetPostStatus
	| SetPostTerms
	| SetAuthorId
	| SetDateValue
	| SetPremiumItems< PremiumItemType >
	| SetReferenceInput
	| SetReferences
	| SetNewComments
	| SetTimeValue
	| SetTasks;

/**
 * Internal dependencies
 */
import type { EditorialReference } from '../types';

export function setTitle( title: string ): SetTitle {
	return {
		type: 'SET_TITLE',
		title,
	};
} //end setTitle()

export function setPostType( postType: PostTypeName ): SetPostType {
	return {
		type: 'SET_POST_TYPE',
		postType,
	};
} //end setPostType()

export function setPostStatus( postStatus: PostStatusSlug ): SetPostStatus {
	return {
		type: 'SET_POST_STATUS',
		postStatus,
	};
} //end setPostStatus()

export function setPostTerms(
	taxonomy: TaxonomySlug,
	terms: ReadonlyArray< Term >
): SetPostTerms {
	return {
		type: 'SET_POST_TERMS',
		taxonomy,
		terms,
	};
} //end setPostTerms()

export function setAuthorId( authorId: AuthorId ): SetAuthorId {
	return {
		type: 'SET_AUTHOR',
		authorId,
	};
} //end setAuthorId()

export function setDateValue( dateValue: string ): SetDateValue {
	return {
		type: 'SET_DATE',
		dateValue,
	};
} //end setDateValue()

export function setTimeValue( timeValue: string ): SetTimeValue {
	return {
		type: 'SET_TIME',
		timeValue,
	};
} //end setTimeValue()

export function setPremiumItems< Type extends PremiumItemType >(
	typeName: Type,
	items: ReadonlyArray< PremiumItems[ Type ] >
): SetPremiumItems< Type > {
	return {
		type: 'SET_PREMIUM_ITEMS',
		typeName,
		items,
	};
} //end setPremiumItems()

export function setTasks( tasks: ReadonlyArray< EditorialTask > ): SetTasks {
	return {
		type: 'SET_TASKS',
		tasks,
	};
} //end setTasks()

export function setReferenceInput( url: string ): SetReferenceInput {
	return {
		type: 'SET_REFERENCE_INPUT',
		url,
	};
} //end setReferenceInput()

export function setReferences(
	references: ReadonlyArray< EditorialReference >
): SetReferences {
	return {
		type: 'SET_REFERENCES',
		references,
	};
} //end setReferences()

export function setNewComments(
	comments: ReadonlyArray< EditorialComment >
): SetNewComments {
	return {
		type: 'SET_NEW_COMMENTS',
		comments,
	};
} //end setNewComments()

// ============
// HELPER TYPES
// ============

type SetTitle = {
	readonly type: 'SET_TITLE';
	readonly title: string;
};

type SetPostType = {
	readonly type: 'SET_POST_TYPE';
	readonly postType: PostTypeName;
};

type SetPostStatus = {
	readonly type: 'SET_POST_STATUS';
	readonly postStatus: PostStatusSlug;
};

type SetPostTerms = {
	readonly type: 'SET_POST_TERMS';
	readonly taxonomy: TaxonomySlug;
	readonly terms: ReadonlyArray< Term >;
};

type SetAuthorId = {
	readonly type: 'SET_AUTHOR';
	readonly authorId: AuthorId;
};

type SetDateValue = {
	readonly type: 'SET_DATE';
	readonly dateValue: string;
};

type SetTimeValue = {
	readonly type: 'SET_TIME';
	readonly timeValue: string;
};

type SetPremiumItems< Type extends PremiumItemType > = {
	readonly type: 'SET_PREMIUM_ITEMS';
	readonly typeName: Type;
	readonly items: ReadonlyArray< PremiumItems[ Type ] >;
};

type SetTasks = {
	readonly type: 'SET_TASKS';
	readonly tasks: ReadonlyArray< EditorialTask >;
};

type SetReferenceInput = {
	readonly type: 'SET_REFERENCE_INPUT';
	readonly url: string;
};

type SetReferences = {
	readonly type: 'SET_REFERENCES';
	readonly references: ReadonlyArray< EditorialReference >;
};

type SetNewComments = {
	readonly type: 'SET_NEW_COMMENTS';
	readonly comments: ReadonlyArray< EditorialComment >;
};
