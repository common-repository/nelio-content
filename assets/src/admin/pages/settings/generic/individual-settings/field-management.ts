/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { store as NC_SETTINGS } from './store';
import type { Value as PostTypeValue } from './fields/post-type-setting/config';

const NO_POST_TYPES: PostTypeValue = [];

// =========
// ANALYTICS
// =========

let previousAnalyticsPostTypes =
	select( NC_SETTINGS ).getValue< PostTypeValue >(
		'nelio-content_settings[analytics_post_types]'
	) || NO_POST_TYPES;
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
subscribe( () => {
	const currentAnalyticsPostTypes =
		select( NC_SETTINGS ).getValue< PostTypeValue >(
			'nelio-content_settings[analytics_post_types]'
		) || NO_POST_TYPES;
	if ( currentAnalyticsPostTypes !== previousAnalyticsPostTypes ) {
		previousAnalyticsPostTypes = currentAnalyticsPostTypes;
		toggleAnalytics( currentAnalyticsPostTypes, true );
	} //end if
}, NC_SETTINGS );
toggleAnalytics( previousAnalyticsPostTypes, false );

function toggleAnalytics( value: PostTypeValue, refreshDisabled: boolean ) {
	const { setAttributes } = dispatch( NC_SETTINGS );
	void setAttributes( 'nelio-content_settings[ga4_property_id]', {
		disabled: ! value.length,
		refreshDisabled,
	} );
} // toggleAnalytics()

// ===
// EFI
// ===

let previousEfiPostTypes =
	select( NC_SETTINGS ).getValue< PostTypeValue >(
		'nelio-content_settings[efi_post_types]'
	) || NO_POST_TYPES;
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
subscribe( () => {
	const currentEfiPostTypes =
		select( NC_SETTINGS ).getValue< PostTypeValue >(
			'nelio-content_settings[efi_post_types]'
		) || NO_POST_TYPES;
	if ( currentEfiPostTypes !== previousEfiPostTypes ) {
		previousEfiPostTypes = currentEfiPostTypes;
		toggleEfi( previousEfiPostTypes );
	} //end if
}, NC_SETTINGS );
toggleEfi( previousEfiPostTypes );

function toggleEfi( value: PostTypeValue ) {
	type MaybeSelect = HTMLSelectElement | null;
	const disabled = ! value.length;

	const efiMode = document.getElementById( 'efi-mode' ) as MaybeSelect;
	if ( efiMode ) {
		efiMode.disabled = disabled;
	} //end if

	const autoFeatImg = document.getElementById(
		'auto-feat-image'
	) as MaybeSelect;
	if ( autoFeatImg ) {
		autoFeatImg.disabled = disabled;
	} //end if
} //end toggleEfi()
