/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x, _nx, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { keys } from 'lodash';
import type {
	Author,
	AuthorId,
	Dict,
	Maybe,
	MonthlyRecurrenceSettings,
	Post,
	PostId,
	PostStatusSlug,
	PostType,
	PostTypeContext,
	PostTypeName,
	PremiumFeature,
	RecurrenceContext,
	RecurrenceSettings,
	SocialProfile,
	SocialTemplate,
	SubscriptionPlan,
	Uuid,
	Weekday,
	WeeklyRecurrenceSettings,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_DATA } from './store';

export const useAuthor = ( authorId?: AuthorId ): Maybe< Author > =>
	useSelect( ( select ) => select( NC_DATA ).getAuthor( authorId ) );

export const useAuthorName = (
	authorId?: AuthorId,
	defaultName?: string
): string => {
	const author = useAuthor( authorId );
	const isItYou = useIsUserYou( authorId );
	const authorName = author?.name ?? defaultName ?? '';
	return isItYou ? _x( 'You', 'text', 'nelio-content' ) : authorName;
};

export const useSocialProfile = ( id: Maybe< Uuid > ): Maybe< SocialProfile > =>
	useSelect( ( select ) => {
		const { getSocialProfile } = select( NC_DATA );
		return id ? getSocialProfile( id ) : undefined;
	} );

export const useSocialProfiles = (): ReadonlyArray< SocialProfile > =>
	useSelect( ( select ) => select( NC_DATA ).getSocialProfiles() );

export const useSocialTemplate = ( id: Uuid ): Maybe< SocialTemplate > =>
	useSelect( ( select ) => select( NC_DATA ).getSocialTemplate( id ) );

export const useSocialTemplates = (
	post?: Maybe< Post >
): ReadonlyArray< SocialTemplate > =>
	useSelect( ( select ) => select( NC_DATA ).getSocialTemplates( post ) );

export const usePost = ( postId?: PostId ): Maybe< Post > =>
	useSelect( ( select ) => select( NC_DATA ).getPost( postId ) );

export const usePostTypes = (
	context: PostTypeContext
): ReadonlyArray< PostType > =>
	useSelect( ( select ) => select( NC_DATA ).getPostTypes( context ) || [] );

export const usePostType = ( type: Maybe< PostTypeName > ): Maybe< PostType > =>
	useSelect( ( select ) => {
		const { getPostType } = select( NC_DATA );
		return type ? getPostType( type ) : undefined;
	} );

export const usePostStatuses = (
	type?: PostTypeName
): ReadonlyArray< PostStatusSlug > =>
	useSelect( ( select ) =>
		select( NC_DATA )
			.getPostStatuses( type )
			.map( ( s ) => s.slug )
	);

export const useToday = (): string =>
	useSelect( ( select ) => select( NC_DATA ).getToday() );

export const useUtcNow = (): string =>
	useSelect( ( select ) => select( NC_DATA ).getUtcNow() );

export const useIsUserYou = ( userId?: AuthorId ): boolean =>
	useSelect( ( select ) => select( NC_DATA ).getCurrentUserId() === userId );

export const useAdminUrl = (
	path: string,
	args: Dict< string > = {}
): string =>
	useSelect( ( select ) => select( NC_DATA ).getAdminUrl( path, args ) );

export const useIsSubscribed = ( plan?: SubscriptionPlan ): boolean =>
	useSelect( ( select ) => select( NC_DATA ).isSubscribed( plan ) );

export const useCanManagePlugin = (): boolean =>
	useSelect( ( select ) => select( NC_DATA ).canCurrentUserManagePlugin() );

export const useRecurrenceSummary = (
	context: RecurrenceContext,
	settings: RecurrenceSettings
): string => {
	return sprintf(
		'%1$s, %2$s',
		stringifyRecurrencePeriod( context, settings ),
		stringifyRecurrenceTimes( settings )
	);
};

export const useIsFeatureEnabled = ( feature: PremiumFeature ): boolean =>
	useSelect( ( select ) => select( NC_DATA ).isFeatureEnabled( feature ) );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFeatureGuard = < F extends ( ...args: any[] ) => void >(
	feature: PremiumFeature,
	isGuardEnabled: boolean = true
): ( ( f: F ) => F ) => {
	const isFeatureEnabled = useIsFeatureEnabled( feature );
	const { openPremiumDialog } = useDispatch( NC_DATA );
	return ( f: F ): F => {
		if ( isFeatureEnabled ) {
			return f;
		} //end if

		if ( isGuardEnabled ) {
			return ( () => void openPremiumDialog( feature ) ) as F;
		} //end if

		return f;
	};
};

// =======
// HELPERS
// =======

const stringifyRecurrencePeriod = (
	context: RecurrenceContext,
	settings: RecurrenceSettings
): string => {
	const { period, interval } = settings;
	switch ( period ) {
		case 'day':
			return 1 === interval
				? _x( 'Daily', 'text', 'nelio-content' )
				: sprintf(
						/* translators: interval count */
						_nx(
							'Every %d day',
							'Every %d days',
							interval,
							'text',
							'nelio-content'
						),
						interval
				  );

		case 'week':
			return stringifyWeek( settings );

		case 'month':
			return stringifyMonth( context, settings );
	} //end switch
};

const stringifyRecurrenceTimes = ( settings: RecurrenceSettings ): string => {
	if ( settings.occurrences <= 2 ) {
		return _x( 'once', 'text', 'nelio-content' );
	} //end if

	return sprintf(
		/* translators: number of times */
		_nx(
			'%d time',
			'%d times',
			settings.occurrences,
			'text',
			'nelio-content'
		),
		settings.occurrences
	);
};

const stringifyWeek = ( settings: WeeklyRecurrenceSettings ): string => {
	const interval =
		settings.interval === 1
			? _x( 'Weekly', 'text', 'nelio-content' )
			: sprintf(
					/* translators: interval count */
					_nx(
						'Every %d week',
						'Every %d weeks',
						settings.interval,
						'text',
						'nelio-content'
					),
					settings.interval
			  );

	if (
		settings.weekdays.length === 2 &&
		settings.weekdays.includes( 'sat' ) &&
		settings.weekdays.includes( 'sun' )
	) {
		return `${ interval } ${ _x(
			'on weekends',
			'text',
			'nelio-content'
		) }`;
	} //end if

	if (
		settings.weekdays.length === 5 &&
		! settings.weekdays.includes( 'sat' ) &&
		! settings.weekdays.includes( 'sun' )
	) {
		return `${ interval } ${ _x(
			'on weekdays',
			'text',
			'nelio-content'
		) }`;
	} //end if

	const dict =
		settings.weekdays.length === 1 ? FULL_WEEKDAYS : SHORT_WEEKDAYS;
	const weekdays = sprintf(
		/* translators: weekday or list of weekdays */
		_x( 'on %s', 'text', 'nelio-content' ),
		keys( dict )
			.filter( ( wd ) => settings.weekdays.includes( wd ) )
			.map( ( wd ) => dict[ wd ] )
			.join( ', ' )
	);
	return `${ interval } ${ weekdays }`;
};

const stringifyMonth = (
	context: RecurrenceContext,
	settings: MonthlyRecurrenceSettings
): string => {
	const interval =
		settings.interval === 1
			? _x( 'Monthly', 'text', 'nelio-content' )
			: sprintf(
					/* translators: interval count */
					_nx(
						'Every %d month',
						'Every %d months',
						settings.interval,
						'text',
						'nelio-content'
					),
					settings.interval
			  );

	if ( settings.day === 'monthday' ) {
		const day = sprintf(
			/* translators: month day */
			_x( 'on day %d', 'text', 'nelio-content' ),
			context.monthday
		);
		return `${ interval } ${ day }`;
	} //end

	const d = settings.day === 'last-weekday' ? 5 : context.weekindex[ 0 ];
	const wd = context.weekday;

	switch ( d ) {
		case 1:
			return `${ interval } ${ sprintf(
				/* translators: weekday */
				_x( 'on the first %s', 'text', 'nelio-content' ),
				FULL_WEEKDAYS[ wd ]
			) }`;

		case 2:
			return `${ interval } ${ sprintf(
				/* translators: weekday */
				_x( 'on the second %s', 'text', 'nelio-content' ),
				FULL_WEEKDAYS[ wd ]
			) }`;

		case 3:
			return `${ interval } ${ sprintf(
				/* translators: weekday */
				_x( 'on the third %s', 'text', 'nelio-content' ),
				FULL_WEEKDAYS[ wd ]
			) }`;

		case 4:
			return `${ interval } ${ sprintf(
				/* translators: weekday */
				_x( 'on the fourth %s', 'text', 'nelio-content' ),
				FULL_WEEKDAYS[ wd ]
			) }`;

		case 5:
			return `${ interval } ${ sprintf(
				/* translators: weekday */
				_x( 'on the last %s', 'text', 'nelio-content' ),
				FULL_WEEKDAYS[ wd ]
			) }`;
	} //end switch
};

const SHORT_WEEKDAYS: Record< Weekday, string > = {
	mon: _x( 'Mon', 'text (monday)', 'nelio-content' ),
	tue: _x( 'Tue', 'text (tuesday)', 'nelio-content' ),
	wed: _x( 'Wed', 'text (wednesday)', 'nelio-content' ),
	thu: _x( 'Thu', 'text (thursday)', 'nelio-content' ),
	fri: _x( 'Fri', 'text (friday)', 'nelio-content' ),
	sat: _x( 'Sat', 'text (saturday)', 'nelio-content' ),
	sun: _x( 'Sun', 'text (sunday)', 'nelio-content' ),
};

const FULL_WEEKDAYS: Record< Weekday, string > = {
	mon: _x( 'Monday', 'text', 'nelio-content' ),
	tue: _x( 'Tuesday', 'text', 'nelio-content' ),
	wed: _x( 'Wednesday', 'text', 'nelio-content' ),
	thu: _x( 'Thursday', 'text', 'nelio-content' ),
	fri: _x( 'Friday', 'text', 'nelio-content' ),
	sat: _x( 'Saturday', 'text', 'nelio-content' ),
	sun: _x( 'Sunday', 'text', 'nelio-content' ),
};
