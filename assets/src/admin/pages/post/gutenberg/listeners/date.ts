/**
 * WordPress dependencies
 */
import { select, subscribe } from '@safe-wordpress/data';
import { store as EDITOR } from '@safe-wordpress/editor';

/**
 * External dependencies
 */
import { wpifyDateTime } from '@nelio-content/date';
import type { Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import type { Actions } from './types';

export function listenToDate( { setDate }: Actions ): void {
	const { isEditedPostDateFloating, getEditedPostAttribute } =
		select( EDITOR );

	let prevDate: Maybe< string >;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	subscribe( () => {
		const date = getUtcDate(
			isEditedPostDateFloating()
				? ''
				: getEditedPostAttribute( 'date' ) ?? ''
		);
		if ( prevDate === date ) {
			return;
		} //end if
		prevDate = date;

		void setDate( date );
	}, EDITOR );
} //end listenToDate()

function getUtcDate( localDate: string ): Maybe< string > {
	if ( ! localDate ) {
		return;
	} //end if

	const date = localDate.substring( 0, 10 );
	const time = localDate.substring( 11, 16 );
	return wpifyDateTime( 'c', date, time );
} //end getUtcDate()
