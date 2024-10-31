/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

export type SearcherProps = {
	readonly className?: string;
};

// NOTE. This is a workaround to prevent auto-loading on component re-render.
let lastQuery: string | undefined;

export const Searcher = ( { className = '' }: SearcherProps ): JSX.Element => {
	const query = useQuery();
	const { setReusableMessageQuery, loadReusableMessages } =
		useDispatch( NC_DATA );

	useEffect( () => {
		const timeout = setTimeout(
			() => {
				if ( query === lastQuery ) {
					return;
				} //end if
				lastQuery = query;
				void loadReusableMessages( query );
			},
			undefined === lastQuery ? 0 : 300
		);
		return () => clearTimeout( timeout );
	}, [ query, loadReusableMessages ] );

	return (
		<div
			className={ classnames( {
				[ className ]: true,
				'nelio-content-reusable-message-searcher': true,
			} ) }
		>
			<TextControl
				value={ query }
				onChange={ setReusableMessageQuery }
				placeholder={ _x( 'Search', 'command', 'nelio-content' ) }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useQuery = () =>
	useSelect( ( select ) => select( NC_DATA ).getReusableMessageQuery() );
