/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';

export type SocialMessageContentProps = {
	readonly className?: string;
	readonly message: string;
	readonly schedule: string;
};

export const SocialMessageContent = ( {
	className,
	message,
	schedule,
}: SocialMessageContentProps ): JSX.Element => {
	const time = useSelect( ( select ) =>
		select( NC_CALENDAR ).formatCalendarTime( schedule )
	);
	return (
		<div className={ className }>
			<strong>{ time }</strong> <span>{ message }</span>
		</div>
	);
};
