/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { xor } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { getPremiumComponent } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type { PostTypeName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

import { PostAuthor } from './post-author';
// TODO. Create this PostTaxonomies component or something
// import { PostTaxonomies } from './post-taxonomies';
import { PostType } from './post-type';
import { PostStatus } from './post-status';

export const PostFilter = (): JSX.Element => {
	const { disabledPostTypes, postAuthor, postTypes } = usePostFilters();

	const { togglePostType, setPostAuthor } = usePostFilterActions();
	const premiumStatus = useSelect( ( select ) =>
		select( NC_DATA ).getPremiumStatus()
	);

	const FutureActionsFilter = getPremiumComponent(
		'calendar/future-actions-filter',
		'null'
	);

	return (
		<div className="nelio-content-post-filters">
			<PostAuthor value={ postAuthor } onChange={ setPostAuthor } />
			<div className="nelio-content-post-filters__by-type">
				<div>{ _x( 'Content Type', 'text', 'nelio-content' ) }</div>

				<ul className="nelio-content-post-filters__post-types">
					{ postTypes.map( ( { name, labels: { singular } } ) => (
						<PostType
							key={ `nelio-content-post-filters__post-type-${ name }` }
							name={ name }
							label={ singular }
							checked={ ! disabledPostTypes.includes( name ) }
							onChange={ () => togglePostType( name ) }
						/>
					) ) }
				</ul>
			</div>
			<PostStatus />
			{ premiumStatus === 'ready' && (
				<>
					<strong>
						{ _x( 'Additional Filters', 'text', 'nelio-content' ) }
					</strong>
					<FutureActionsFilter />
				</>
			) }
		</div>
	);
};

// =====
// HOOKS
// =====

const usePostFilters = () =>
	useSelect( ( select ) => {
		const { getPostTypes } = select( NC_DATA );
		const { getDisabledPostTypes, getPostAuthorFilter } =
			select( NC_CALENDAR );

		const postTypes = getPostTypes( 'calendar' );
		return {
			postTypes,
			disabledPostTypes: getDisabledPostTypes(),
			postAuthor: getPostAuthorFilter(),
		};
	} );

const usePostFilterActions = () => {
	const { disabledPostTypes } = usePostFilters();
	const { setDisabledPostTypes, setPostAuthorFilter } =
		useDispatch( NC_CALENDAR );

	return {
		togglePostType: ( name: PostTypeName ) =>
			setDisabledPostTypes( toggle( disabledPostTypes, name ) ),

		setPostAuthor: setPostAuthorFilter,
	};
};

function toggle< T >( arr: ReadonlyArray< T >, x: T ) {
	return xor( arr, [ x ] );
} //end toggle()
