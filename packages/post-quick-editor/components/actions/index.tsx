/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { mapValues, orderBy, pick, toPairs, isEqual, keys } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { extractDateTimeValues, isDefined } from '@nelio-content/utils';
import type { TaxonomySlug, Term } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { EditActions } from './edit-actions';
import { ViewActions } from './view-actions';

import { store as NC_POST_EDITOR } from '../../store';
import { useCanEditPost } from '../../hooks';

export const Actions = (): JSX.Element => {
	const canEditPost = useCanEditPost();
	const isDirty = useIsDirty();
	return canEditPost && isDirty ? <EditActions /> : <ViewActions />;
};

// =====
// HOOKS
// =====

const useIsDirty = () =>
	useSelect( ( select ) => {
		select( NC_DATA );
		select( NC_POST_EDITOR );

		const { isNewPost } = select( NC_POST_EDITOR );
		if ( isNewPost() ) {
			return true;
		} //end if

		const postId = select( NC_POST_EDITOR ).getId();
		const post = select( NC_DATA ).getPost( postId );
		if ( ! post ) {
			return true;
		} //end if

		const oldTasks = select( NC_DATA ).getTasksRelatedToPost( postId );
		if ( select( NC_POST_EDITOR ).areTasksDirty( oldTasks ) ) {
			return true;
		} //end if

		const { arePremiumItemsDirty: check } = select( NC_POST_EDITOR );
		const arePremiumItemsDirty = toPairs(
			select( NC_DATA ).getAllPremiumItemsRelatedToPost( postId )
		)
			.map( ( [ type, items ] ) =>
				items ? ( [ type, items ] as const ) : undefined
			)
			.filter( isDefined )
			.map( ( [ type, items ] ) => check( type, items ) )
			.some( ( x ) => x );
		if ( arePremiumItemsDirty ) {
			return true;
		} //end if

		const oldRefs = select( NC_DATA ).getSuggestedReferences( postId );
		if ( select( NC_POST_EDITOR ).areReferencesDirty( oldRefs ) ) {
			return true;
		} //end if

		const newComments = select( NC_POST_EDITOR ).getNewComments();
		if ( !! newComments.length ) {
			return true;
		} //end if

		const {
			getTitle,
			getAuthorId,
			getDateValue,
			getTimeValue,
			getPostStatus,
			getPostTermsByTaxonomy,
		} = select( NC_POST_EDITOR );

		const stringifyTaxos = (
			taxos: Record< TaxonomySlug, readonly Term[] >
		) =>
			JSON.stringify( mapValues( taxos, ( ts ) => orderBy( ts, 'id' ) ) );

		const newPost = {
			title: getTitle(),
			status: getPostStatus(),
			author: getAuthorId(),
			dateValue: getDateValue() ?? '',
			timeValue: getTimeValue() ?? '',
			taxonomies: stringifyTaxos( getPostTermsByTaxonomy() ),
		};
		const dtv = extractDateTimeValues( post.date );
		const originalPost = {
			...pick( post, keys( newPost ) ),
			taxonomies: stringifyTaxos( post.taxonomies ),
			dateValue: dtv?.dateValue ?? '',
			timeValue: dtv?.timeValue ?? '',
		};

		return ! isEqual( newPost, originalPost );
	} );
