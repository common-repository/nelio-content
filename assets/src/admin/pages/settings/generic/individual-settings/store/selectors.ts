/**
 * External dependencies
 */
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { State, FieldId, Attributes } from './types';

type GetValue = typeof _getValue & {
	CurriedSignature: < T >( field: FieldId ) => Maybe< T >;
};
export const getValue: GetValue = _getValue as GetValue;
function _getValue< T >( state: State, field: FieldId ): Maybe< T > {
	return state.values[ field ] as T;
} //end _getValue()

type GetAttributes = typeof _getAttributes & {
	CurriedSignature: < A extends Attributes = Attributes >(
		field: FieldId
	) => Maybe< A >;
};
export const getAttributes: GetAttributes = _getAttributes as GetAttributes;
function _getAttributes< A extends Attributes = Attributes >(
	state: State,
	field: FieldId
): Maybe< A > {
	return state.attributes[ field ] as Maybe< A >;
} //end _getAttributes()
