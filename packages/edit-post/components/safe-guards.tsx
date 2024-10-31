/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { createHigherOrderComponent } from '@safe-wordpress/compose';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { LoadingAnimation } from '@nelio-content/components';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../store';

export const withPostReadyCheck = createHigherOrderComponent(
	( Component: ( _: unknown ) => JSX.Element ) =>
		( props ): JSX.Element => {
			const isPostReady = useSelect( ( select ) =>
				select( NC_EDIT_POST ).isPostReady()
			);

			if ( isPostReady ) {
				return <Component { ...props } />;
			} //end if

			return (
				<>
					{ _x(
						'Please save post first to access this feature.',
						'user',
						'nelio-content'
					) }
				</>
			);
		},
	'withPostReadyCheck'
);

export const withLoadingCheck =
	< C extends ( props: unknown ) => JSX.Element | null >(
		fnName:
			| 'isRetrievingEditorialComments'
			| 'isRetrievingSocialMessages'
			| 'isRetrievingEditorialTasks'
	): ( ( c: C ) => C ) =>
	( c: C ) =>
		createHigherOrderComponent(
			( Component: C ) => ( props ) => {
				const isLoading = useSelect(
					( select ) => !! select( NC_EDIT_POST )[ fnName ]()
				);

				if ( ! isLoading ) {
					return <Component { ...props } />;
				} //end if

				return (
					<LoadingAnimation
						text={ _x( 'Loading…', 'text', 'nelio-content' ) }
						isSmall
					/>
				);
			},
			'withLoadingCheck'
		)( c ) as C;
