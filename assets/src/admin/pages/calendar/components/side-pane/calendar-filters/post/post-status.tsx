/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { CheckboxControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { map, flatten, uniq, xor } from 'lodash';
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { store as NC_DATA } from '@nelio-content/data';

export const PostStatus = (): JSX.Element | null => {
	const [ disabledStatuses, setDisabledStatuses ] = useDisabledStatuses();
	const options = usePostStatuses();

	const toggleStatus = ( status: string ) =>
		setDisabledStatuses( xor( disabledStatuses, [ status ] ) );

	if ( ! options.length ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-post-filters__by-status">
			<div>{ _x( 'Post Status', 'text', 'nelio-content' ) }</div>
			<ul className="nelio-content-post-filters__statuses">
				{ options.map( ( { label, value } ) => (
					<li
						key={ `nelio-content-post-filters__category-${ value }` }
					>
						<CheckboxControl
							label={ label }
							checked={ ! disabledStatuses.includes( value ) }
							onChange={ () => toggleStatus( value ) }
						/>
					</li>
				) ) }
			</ul>
		</div>
	);
};

// =====
// HOOKS
// =====

const usePostStatuses = () =>
	useSelect( ( select ) => {
		const { getPostTypes, getPostStatuses } = select( NC_DATA );
		const { getDisabledPostTypes } = select( NC_CALENDAR );
		const disabledPostTypes = getDisabledPostTypes();
		const types = ( getPostTypes( 'calendar' ) || [] ).filter(
			( p ) => ! disabledPostTypes.includes( p.name )
		);
		const statuses = flatten(
			types.map( ( { name } ) => getPostStatuses( name ) )
		).filter( ( { slug } ) => 'nelio-content-unscheduled' !== slug );

		const namesByStatus = statuses.reduce(
			( r, { slug, name } ) =>
				'nelio-content-unscheduled' === slug
					? r
					: {
							...r,
							[ slug ]: uniq( [ ...( r[ slug ] ?? [] ), name ] ),
					  },
			{} as Record< string, ReadonlyArray< string > >
		);

		return map( namesByStatus, ( names, slug ) => ( {
			value: slug,
			label: names.join( ', ' ),
		} ) );
	} );

const useDisabledStatuses = () => {
	const disabledStatuses = useSelect( ( select ) =>
		select( NC_CALENDAR ).getDisabledStatuses()
	);
	const { setDisabledStatuses } = useDispatch( NC_CALENDAR );
	return [ disabledStatuses, setDisabledStatuses ] as const;
};
