/**
 * WordPres dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl, CheckboxControl } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import type { Weekday } from '@nelio-content/types';
import { useSelect } from '@safe-wordpress/data';
import { store as NC_DATA } from '@nelio-content/data';

export type WeekDaysSelectorProps = {
	readonly days: Record< Weekday, boolean >;
	readonly onChange: ( value: Record< Weekday, boolean > ) => void;
};

export const WeekDaysSelector = ( {
	days,
	onChange,
}: WeekDaysSelectorProps ): JSX.Element | null => {
	const firstDayOfWeek = useSelect( ( select ) =>
		select( NC_DATA ).getFirstDayOfWeek()
	);
	const weekdays: ReadonlyArray< Day > = [
		{ id: 'sun', label: _x( 'SUN', 'text', 'nelio-content' ) },
		{ id: 'mon', label: _x( 'MON', 'text', 'nelio-content' ) },
		{ id: 'tue', label: _x( 'TUE', 'text', 'nelio-content' ) },
		{ id: 'wed', label: _x( 'WED', 'text', 'nelio-content' ) },
		{ id: 'thu', label: _x( 'THU', 'text', 'nelio-content' ) },
		{ id: 'fri', label: _x( 'FRI', 'text', 'nelio-content' ) },
		{ id: 'sat', label: _x( 'SAT', 'text', 'nelio-content' ) },
	];
	const orderedWeekdays = [
		...weekdays.slice( firstDayOfWeek ),
		...weekdays.slice( 0, firstDayOfWeek ),
	];

	return (
		<BaseControl
			id="nelio-content-social-template-editor__week-days-selector"
			label={ _x( 'Week Days', 'text', 'nelio-content' ) }
		>
			<div className="nelio-content-social-template-editor__week-days-selector">
				{ orderedWeekdays.map( ( { id, label }, index ) => (
					<CheckboxControl
						key={ index }
						label={ label }
						checked={ days[ id ] }
						onChange={ ( value ) =>
							onChange( { ...days, [ id ]: value } )
						}
					/>
				) ) }
			</div>
		</BaseControl>
	);
};

// ============
// HELPER TYPES
// ============

type Day = {
	readonly id: Weekday;
	readonly label: string;
};
