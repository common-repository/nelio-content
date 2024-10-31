/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	BaseControl,
	Button,
	TextControl,
	ToggleControl,
} from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type {
	Maybe,
	QueryArgName,
	QueryArgValue,
	RegularQueryArg,
	OverwriteableQueryArg,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_PROFILE_SETTINGS } from '~/nelio-content-pages/settings/social-profiles/store';

export const PermalinkParametersSetting = (): JSX.Element => {
	const { items, add, replace } = useQueryArgs();

	return (
		<div className="nelio-content-profile-settings-args">
			<div className="nelio-content-profile-settings-args__name">
				<span>{ _x( 'URL Parameters', 'text', 'nelio-content' ) }</span>
				<Button variant="link" onClick={ add }>
					{ _x(
						'Add New',
						'command (URL parameter)',
						'nelio-content'
					) }
				</Button>
			</div>
			<div className="nelio-content-profile-settings-args__list">
				{ items.map( ( item, index ) => (
					<QueryArg
						key={ index }
						name={ item[ 0 ] }
						value={ item[ 1 ] }
						isOverwriteable={ item[ 2 ] }
						showLabel={ ! index }
						onNameChange={ ( n ) =>
							replace(
								item,
								item[ 2 ]
									? [ n, item[ 1 ], true ]
									: [ n, item[ 1 ] ]
							)
						}
						onValueChange={ ( v ) =>
							replace(
								item,
								item[ 2 ]
									? [ item[ 0 ], v, true ]
									: [ item[ 0 ], v ]
							)
						}
						onOverwriteChange={ ( b ) =>
							replace(
								item,
								b
									? [ item[ 0 ], item[ 1 ], true ]
									: [ item[ 0 ], item[ 1 ] ]
							)
						}
					/>
				) ) }
			</div>
			<div className="nelio-content-profile-settings-args__help">
				{ sprintf(
					/* translators: a placeholder name */
					_x(
						'Add URL parameters to links inserted with the %s placeholder. To remove parameters, leave their names empty.',
						'user',
						'nelio-content'
					),
					'{permalink}'
				) }
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
	readonly isOverwriteable: Maybe< true >;
	readonly showLabel: boolean;
	readonly onNameChange: ( name: QueryArgName ) => void;
	readonly onValueChange: ( value: QueryArgValue ) => void;
	readonly onOverwriteChange: ( overwriteable: boolean ) => void;
};

const QueryArg = ( {
	name,
	value,
	showLabel,
	isOverwriteable,
	onNameChange,
	onValueChange,
	onOverwriteChange,
}: QueryArgProps ) => (
	<div className="nelio-content-profile-settings-args__item">
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
		{ showLabel ? (
			<BaseControl
				id="nelio-content-profile-settings-args__first-query-arg"
				label={ _x( 'Fallback', 'text (query arg)', 'nelio-content' ) }
			>
				<ToggleControl
					label=""
					checked={ isOverwriteable }
					onChange={ onOverwriteChange }
				/>
			</BaseControl>
		) : (
			<ToggleControl
				label=""
				checked={ isOverwriteable }
				onChange={ onOverwriteChange }
			/>
		) }
	</div>
);

// =====
// HOOKS
// =====

const useQueryArgs = () => {
	const items = useSelect( ( select ) =>
		select( NC_PROFILE_SETTINGS ).getEditingQueryArgs()
	);
	const { setEditingQueryArgs } = useDispatch( NC_PROFILE_SETTINGS );
	return {
		items,
		add: () => setEditingQueryArgs( [ ...items, [ '', '' ] ] ),
		replace: (
			oldItem: RegularQueryArg | OverwriteableQueryArg,
			newItem: RegularQueryArg | OverwriteableQueryArg
		) =>
			setEditingQueryArgs(
				items.map( ( item ) => ( item === oldItem ? newItem : item ) )
			),
	};
};
