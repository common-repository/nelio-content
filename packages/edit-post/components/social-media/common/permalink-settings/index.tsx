/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import type {
	RegularQueryArg,
	QueryArgName,
	QueryArgValue,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../../store';

export const PermalinkSettings = (): JSX.Element => {
	const { items, add, replace, set } = useQueryArgs();

	useEffect( () => {
		void set( items.filter( ( [ n ] ) => !! trim( n ) ) );
	}, [] );

	return (
		<div className="nelio-content-permalink-settings">
			<div className="nelio-content-permalink-settings__query-args">
				{ items.length ? (
					<p>{ _x( 'URL Parameters:', 'text', 'nelio-content' ) }</p>
				) : (
					<p>
						{ _x(
							'Add custom URL parameters when sharing this post on social media:',
							'user',
							'nelio-content'
						) }
					</p>
				) }
				{ items.map( ( item, index ) => (
					<QueryArg
						key={ index }
						name={ item[ 0 ] }
						value={ item[ 1 ] }
						showLabel={ ! index }
						onNameChange={ ( n ) =>
							replace( item, [ n, item[ 1 ] ] )
						}
						onValueChange={ ( v ) =>
							replace( item, [ item[ 0 ], v ] )
						}
					/>
				) ) }
				<div className="nelio-content-permalink-settings__query-args-actions">
					<Button variant="secondary" onClick={ add }>
						{ _x(
							'Add New',
							'command (URL parameter)',
							'nelio-content'
						) }
					</Button>
				</div>
			</div>
		</div>
	);
};

// =====
// VIEWS
// =====

type QueryArgProps = {
	readonly name: QueryArgName;
	readonly value: QueryArgValue;
	readonly showLabel: boolean;
	readonly onNameChange: ( name: QueryArgName ) => void;
	readonly onValueChange: ( value: QueryArgValue ) => void;
};

const QueryArg = ( {
	name,
	value,
	showLabel,
	onNameChange,
	onValueChange,
}: QueryArgProps ) => (
	<div className="nelio-content-permalink-settings__query-arg">
		<TextControl
			label={
				showLabel ? _x( 'Name', 'text', 'nelio-content' ) : undefined
			}
			placeholder={ _x( 'Name', 'text', 'nelio-content' ) }
			value={ name }
			onChange={ onNameChange }
		/>
		<TextControl
			label={
				showLabel
					? _x( 'Value (optional)', 'text', 'nelio-content' )
					: undefined
			}
			placeholder={ _x( 'Value (optional)', 'text', 'nelio-content' ) }
			value={ value }
			onChange={ onValueChange }
		/>
	</div>
);

// =====
// HOOKS
// =====

const useQueryArgs = () => {
	const items = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getQueryArgs()
	);
	const { setQueryArgs } = useDispatch( NC_EDIT_POST );
	return {
		items,
		add: () => setQueryArgs( [ ...items, [ '', '' ] ] ),
		replace: ( oldItem: RegularQueryArg, newItem: RegularQueryArg ) =>
			setQueryArgs(
				items.map( ( item ) => ( item === oldItem ? newItem : item ) )
			),
		set: setQueryArgs,
	};
};
