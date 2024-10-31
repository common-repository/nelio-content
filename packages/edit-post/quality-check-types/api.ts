/**
 * WordPress dependencies
 */
import { dispatch, select, subscribe } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { isEqual, isFunction, throttle } from 'lodash';
import type {
	Dict,
	Maybe,
	QualityCheckName,
	QualityCheckType,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../store';
import type { State } from '../store/types';

const STORE_LISTENERS: Record< QualityCheckName, StoreListener > = {};

/**
 * Updates post quality settings.
 *
 * @param {Object} settings post quality settings.
 */
export function updatePostQualitySettings(
	settings: Partial< State[ 'postQuality' ][ 'settings' ] > = {}
): void {
	const oldSettings = select( NC_EDIT_POST ).getPostQualitySettings();
	const newSettings = {
		allowedBads: settings.allowedBads ?? oldSettings.allowedBads,
		allowedImprovables:
			settings.allowedImprovables ?? oldSettings.allowedImprovables,
		unacceptableImprovables:
			settings.unacceptableImprovables ??
			oldSettings.unacceptableImprovables,
	};
	void dispatch( NC_EDIT_POST ).setPostQualitySettings( newSettings );
} //end updatePostQualitySettings()

/**
 * Registers a new quality check.
 *
 * @param {string} name     the name of a new quality check.
 * @param {Object} settings quality check settings.
 */
export function registerQualityCheck< A extends Dict, S extends Dict >(
	name: QualityCheckName,
	settings: Partial< Omit< QualityCheckType< A, S >, 'name' > >
): Maybe< QualityCheckType< A, S > > {
	const {
		icon,
		interval = 500,
		settings: qcSettings = {} as S,
		attributes,
		validate,
	} = settings;

	if ( typeof name !== 'string' ) {
		// eslint-disable-next-line
		console.error( 'Quality check names must be strings.' );
		return;
	} //end if

	if ( ! /^[a-z][a-z0-9-]*\/[a-z][a-z0-9-]*$/.test( name ) ) {
		// eslint-disable-next-line
		console.error(
			'Quality check names must contain a namespace prefix, include only lowercase alphanumeric characters or dashes, and start with a letter. Example: my-plugin/my-custom-quality-check'
		);
		return;
	} //end if

	if ( select( NC_EDIT_POST ).getQualityCheckType( name ) ) {
		// eslint-disable-next-line
		console.error( `Quality check “${ name }” is already registered.` );
		return;
	} //end if

	if ( ! icon ) {
		// eslint-disable-next-line
		console.error( `Quality check “${ name }” must have an icon.` );
		return;
	} //end if

	if ( ! isFunction( attributes ) ) {
		// eslint-disable-next-line
		console.error( 'The “attributes” property must be a valid function.' );
		return;
	} //end if

	if ( ! isFunction( validate ) ) {
		// eslint-disable-next-line
		console.error( 'The “validate” property must be a valid function.' );
		return;
	} //end if

	if ( undefined === interval ) {
		return;
	} //end if

	if ( ! qcSettings ) {
		return;
	} //end if

	const newSettings: QualityCheckType< A, S > = {
		name,
		icon,
		interval,
		settings: qcSettings,
		attributes,
		validate,
	};
	void dispatch( NC_EDIT_POST ).addQualityCheckType(
		newSettings as QualityCheckType
	);
	addStoreListener( name, newSettings.interval );

	return newSettings;
} //end registerQualityCheck()

/**
 * Deregisters a quality check.
 *
 * @param {string} name the name of a new quality check.
 */
export function deregisterQualityCheck( name: QualityCheckName ): void {
	removeStoreListener( name );
	void dispatch( NC_EDIT_POST ).removeQualityCheckType( name );
} //end deregisterQualityCheck()

/**
 * Updates the settings of a quality check type.
 *
 * @param {string} name     the name of a new quality check.
 * @param {Object} settings quality check settings.
 */
export function updateQualityCheckSettings(
	name: QualityCheckName,
	settings: Dict
): void {
	const check = select( NC_EDIT_POST ).getQualityCheckType( name );
	if ( ! check ) {
		return;
	} //end if
	void dispatch( NC_EDIT_POST ).updateQualityCheckSettings( name, settings );
} //end updateQualityCheckSettings()

// =======
// HELPERS
// =======

function addStoreListener( name: QualityCheckName, interval: number ): void {
	interval = Math.max( interval, 500 );

	const listener = throttle( () => {
		const { getQualityCheckType } = select( NC_EDIT_POST );
		const type = getQualityCheckType( name );
		if ( ! type ) {
			return;
		} //end if

		const storeListener = STORE_LISTENERS[ name ];
		if ( ! storeListener ) {
			return;
		} //end if

		const { prevAttributes, prevSettings } = storeListener;
		const { settings } = type;
		let attributes: Dict;
		try {
			attributes = type.attributes( select );
		} catch ( e ) {
			// eslint-disable-next-line
			console.error( e );
			return;
		} //end catch

		storeListener.prevAttributes = attributes;
		storeListener.prevSettings = settings;

		if (
			isEqual( prevAttributes, attributes ) &&
			prevSettings === settings
		) {
			return;
		} //end if

		try {
			const {
				status = 'unknown',
				text = _x( 'Unknown status', 'text', 'nelio-content' ),
			} = type.validate( attributes, settings ) || {};

			const { updateQualityCheckItem } = dispatch( NC_EDIT_POST );
			void updateQualityCheckItem( name, status, text );
		} catch ( e ) {
			// eslint-disable-next-line
			console.error( e );
		} //end catch
	}, interval );

	STORE_LISTENERS[ name ] = {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
		unsubscribe: subscribe( listener ),
		prevAttributes: {},
		prevSettings: {},
	};

	listener();
} //end addStoreListener()

function removeStoreListener( name: QualityCheckName ) {
	STORE_LISTENERS[ name ]?.unsubscribe();
	delete STORE_LISTENERS[ name ];
} //end removeStoreListener()

type StoreListener = {
	unsubscribe: () => void;
	prevAttributes: Dict;
	prevSettings: Dict;
};
