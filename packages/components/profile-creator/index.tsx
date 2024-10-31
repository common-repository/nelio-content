/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import {
	useIsUserYou,
	useAuthorName,
	useSocialProfile,
} from '@nelio-content/data';
import { dateI18n, getSettings as getDateSettings } from '@nelio-content/date';
import type { Uuid } from '@nelio-content/types';

export type ProfileCreatorProps = {
	readonly className?: string;
	readonly profileId: Uuid;
};

export const ProfileCreator = ( {
	className,
	profileId,
}: ProfileCreatorProps ): JSX.Element | null => {
	const profile = useSocialProfile( profileId );
	const isYou = useIsUserYou( profile?.creatorId );
	const creatorName = useAuthorName( profile?.creatorId );
	const creationDate = profile?.creationDate;

	if ( ! profile ) {
		return null;
	} //end if

	if ( isYou ) {
		return (
			<div className={ className }>
				{ sprintf(
					/* translators: a date */
					_x( 'Added by you on %s', 'text', 'nelio-content' ),
					dateI18n( getDateSettings().formats.date, creationDate )
				) }
			</div>
		);
	} //end if

	return (
		<div className={ className }>
			{ !! creatorName
				? sprintf(
						/* translators: 1 -> user name, 2 -> a date */
						_x( 'Added by %1$s on %2$s', 'text', 'nelio-content' ),
						creatorName,
						dateI18n( getDateSettings().formats.date, creationDate )
				  )
				: sprintf(
						/* translators: a date */
						_x( 'Added on %s', 'text', 'nelio-content' ),
						dateI18n( getDateSettings().formats.date, creationDate )
				  ) }
		</div>
	);
};
