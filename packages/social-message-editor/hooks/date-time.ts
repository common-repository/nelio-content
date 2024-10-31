/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { SocialMessage } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export const useDate = (): [
	{
		readonly dateType: SocialMessage[ 'dateType' ];
		readonly dateValue: SocialMessage[ 'dateValue' ];
	},
	(
		dateType: SocialMessage[ 'dateType' ],
		dateValue: SocialMessage[ 'dateValue' ]
	) => void,
] => {
	const dateType = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getDateType()
	);
	const dateValue = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getDateValue()
	);

	const { setDateTypeAndValue: setValue } = useDispatch( NC_SOCIAL_EDITOR );
	return [ { dateType, dateValue }, setValue ];
};

export const useTime = (): [
	{
		readonly timeType: SocialMessage[ 'timeType' ];
		readonly timeValue: SocialMessage[ 'timeValue' ];
	},
	(
		timeType: SocialMessage[ 'timeType' ],
		timeValue: SocialMessage[ 'timeValue' ]
	) => void,
] => {
	const timeType = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getTimeType()
	);
	const timeValue = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getTimeValue()
	);

	const { setTimeTypeAndValue: setValue } = useDispatch( NC_SOCIAL_EDITOR );
	return [ { timeType, timeValue }, setValue ];
};

export const useIsPostBasedSchedule = (): boolean =>
	useSelect( ( select ) => {
		const { getDateType } = select( NC_SOCIAL_EDITOR );
		if ( 'exact' === getDateType() ) {
			return false;
		} //end if

		const { getPost } = select( NC_SOCIAL_EDITOR );
		const post = getPost();
		return !! post && 'publish' !== post.status;
	} );
