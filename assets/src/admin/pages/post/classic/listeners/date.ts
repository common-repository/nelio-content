/**
 * External dependencies
 */
import { padStart, values } from 'lodash';
import { wpifyDateTime } from '@nelio-content/date';
import { isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

type DateFields = {
	readonly year: HTMLInputElement | null;
	readonly month: HTMLInputElement | null;
	readonly day: HTMLInputElement | null;
	readonly hour: HTMLInputElement | null;
	readonly minute: HTMLInputElement | null;
};

export function listenToDate( { setDate }: Actions ): void {
	const saveTimestamp = document.querySelector( 'a.save-timestamp' );
	if ( ! saveTimestamp ) {
		return;
	} //end if

	const fields: DateFields = {
		year: document.getElementById( 'aa' ) as HTMLInputElement,
		month: document.getElementById( 'mm' ) as HTMLInputElement,
		day: document.getElementById( 'jj' ) as HTMLInputElement,
		hour: document.getElementById( 'hh' ) as HTMLInputElement,
		minute: document.getElementById( 'mn' ) as HTMLInputElement,
	};

	const fieldList = values( fields );
	const missingFields = fieldList.filter( ( field ) => ! field );
	if ( ! isEmpty( missingFields ) ) {
		return;
	} //end if

	saveTimestamp.addEventListener( 'click', () =>
		updateDate( fields, setDate )
	);
} //end listenToDate()

function updateDate( fields: DateFields, setDate: Actions[ 'setDate' ] ) {
	const year = fields.year?.value ?? '';
	const month = padStart( fields.month?.value, 2, '0' );
	const day = padStart( fields.day?.value, 2, '0' );
	const hour = padStart( fields.hour?.value, 2, '0' );
	const minute = padStart( fields.minute?.value, 2, '0' );

	const date = `${ year }-${ month }-${ day }`;
	const time = `${ hour }:${ minute }`;

	const datetime = wpifyDateTime( 'c', date, time );
	void setDate( datetime );
} //end updateDate()
