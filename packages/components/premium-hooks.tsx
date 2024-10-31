/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { applyFilters, addFilter } from '@safe-wordpress/hooks';

/**
 * External dependencies
 */
import { isFunction } from 'lodash';
import type {
	Maybe,
	PremiumComponents,
	PremiumFeature,
	PremiumComponentName,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { PremiumFeatureButton } from './premium-feature-button';

export function setPremiumComponent< TName extends PremiumComponentName >(
	name: TName,
	component: TName extends keyof PremiumComponents
		? PremiumComponents[ TName ]
		: never
): void {
	const filterName = getFilterName( name );
	addFilter( filterName, filterName, () => component );
} //end setPremiumComponent()

export function getPremiumComponent< TName extends PremiumComponentName >(
	name: TName,
	defaultComponent: ( () => JSX.Element ) | PremiumFeature | 'null'
): () => JSX.Element | null;
export function getPremiumComponent< TName extends PremiumComponentName >(
	name: TName
): Maybe< () => JSX.Element | null >;
export function getPremiumComponent< TName extends PremiumComponentName >(
	name: TName,
	defaultComponent?: ( () => JSX.Element ) | PremiumFeature | 'null'
): Maybe< () => JSX.Element | null > {
	const filterName = getFilterName( name );
	const component = applyFilters( filterName, undefined );
	if ( component ) {
		return component as Maybe< () => JSX.Element | null >;
	} //end if

	if ( isFunction( defaultComponent ) ) {
		return defaultComponent;
	} //end if

	if ( defaultComponent === 'null' ) {
		return NULL;
	} //end if

	const feature = defaultComponent;
	return feature
		? () => <PremiumFeatureButton feature={ feature } />
		: undefined;
} //end getPremiumComponent()

// =======
// HELPERS
// =======

const NULL = () => null;

const getFilterName = ( name: string ) =>
	`nelio-content_components/getPremiumComponent/${ name }`.replaceAll(
		'/',
		'_'
	);
