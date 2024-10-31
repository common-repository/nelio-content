/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SETTINGS } from '../store';
import type { Attributes, FieldId } from '../store/types';

export function useAttributes< A extends Attributes >(
	field: FieldId,
	defaultAttrs: A
): [ A, ( attrs: Partial< A > ) => void ] {
	const attributes = useSelect( ( select ) =>
		select( NC_SETTINGS ).getAttributes< A >( field )
	);
	const { setAttributes } = useDispatch( NC_SETTINGS );
	const setNewAttributes = ( attrs: Partial< A > ) =>
		setAttributes( field, attrs );
	return [ { ...defaultAttrs, ...attributes }, setNewAttributes ];
} //end useAttributes()

export function useValue< T >(
	field: FieldId
): [ Maybe< T >, ( v: T ) => void ] {
	const value = useSelect( ( select ) =>
		select( NC_SETTINGS ).getValue< T >( field )
	);
	const { setValue } = useDispatch( NC_SETTINGS );
	const setNewValue = ( newValue: T ) => setValue( field, newValue );
	return [ value, setNewValue ];
} //end useValue()
