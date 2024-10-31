/**
 * WordPress dependencies
 */
import apiFetch from '@safe-wordpress/api-fetch';
import { dispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type {
	CustomField,
	CustomPlaceholder,
	PostTypeName,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_AUTOMATION_SETTINGS } from '../store';

export async function getCustomFields(): Promise< void > {
	const customFields = await apiFetch<
		Record< PostTypeName, ReadonlyArray< Omit< CustomField, 'value' > > >
	>( {
		path: '/nelio-content/v1/custom-fields',
	} );
	await dispatch( NC_AUTOMATION_SETTINGS ).receiveCustomFields(
		customFields
	);
} //end getCustomFields()

export async function getCustomPlaceholders(): Promise< void > {
	const customPlaceholders = await apiFetch<
		Record<
			PostTypeName,
			ReadonlyArray< Omit< CustomPlaceholder, 'value' > >
		>
	>( {
		path: '/nelio-content/v1/custom-placeholders',
	} );
	await dispatch( NC_AUTOMATION_SETTINGS ).receiveCustomPlaceholders(
		customPlaceholders
	);
} //end getCustomPlaceholders()
