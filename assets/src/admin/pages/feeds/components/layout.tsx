/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import { Layout as FeedsLayout } from './feeds/layout';
import { Layout as SettingsLayout } from './settings/layout';

import { store as NC_FEEDS } from '../store';

export const Layout = (): JSX.Element => {
	const [ areSettingsVisible, hasFeeds ] = useSelect( ( select ) => [
		select( NC_FEEDS ).areSettingsVisible(),
		!! select( NC_DATA ).getFeeds().length,
	] );
	const { showSettings } = useDispatch( NC_FEEDS );

	useEffect( () => void showSettings( ! hasFeeds ), [] );

	return areSettingsVisible ? <SettingsLayout /> : <FeedsLayout />;
};
