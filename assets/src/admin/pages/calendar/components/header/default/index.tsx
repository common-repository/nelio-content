/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, Spinner } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { store as NC_CALENDAR } from '@nelio-content/calendar';
import { SubscribeAction } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';

/**
 * Internal dependencies
 */
import './style.scss';

import { PeriodLabel } from '../period-label';
import TodayIcon from '../today.svg';

import { ItemCreationButton } from './item-creation-button';
import { ErrorPaneToggle } from './error-pane-toggle';
import { ReusableMessageToggle } from './reusable-message-toggle';
import { ToggleFilterPaneButton } from './toggle-filter-pane-button';
import { ToggleUnscheduledViewButton } from './toggle-unscheduled-view-button';
import { MoreOptions } from './more-options';

export const DefaultHeader = (): JSX.Element => {
	const isCalendarSynching = useSelect( ( select ) =>
		select( NC_CALENDAR ).isCalendarSynching()
	);
	const isSocialPublicationPaused = useSelect( ( select ) =>
		select( NC_DATA ).isSocialPublicationPaused()
	);

	const navLabels = useNavigationLabels();
	const { previousPeriod, nextPeriod } = useDispatch( NC_CALENDAR );

	const isTodayVisible = useIsTodayVisible();
	const { showToday } = useDispatch( NC_CALENDAR );

	return (
		<>
			<div className="nelio-content-header__block nelio-content-header__calendar-controls">
				<ItemCreationButton className="nelio-content-header__create-item-button" />

				<Button
					className="nelio-content-header__previous-button"
					icon="arrow-left-alt2"
					label={ navLabels.prev }
					tooltipPosition="bottom center"
					onClick={ () => void previousPeriod() }
				/>

				<Button
					className="nelio-content-header__next-button"
					icon="arrow-right-alt2"
					label={ navLabels.next }
					tooltipPosition="bottom center"
					onClick={ () => void nextPeriod() }
				/>

				<PeriodLabel />

				<Button
					className="nelio-content-header__today-button"
					icon={ <TodayIcon className="dashicon" /> }
					label={ _x( 'Today', 'text', 'nelio-content' ) }
					tooltipPosition="bottom center"
					onClick={ () => void showToday() }
					disabled={ isTodayVisible }
				/>

				<SubscribeAction className="nelio-content-header__promo-button" />
				{ isCalendarSynching && <Spinner /> }
			</div>

			{ !! isSocialPublicationPaused && (
				<div className="nelio-content-header__block">
					<span
						title={ _x(
							'Publication on social media is paused and, therefore, Nelio Content will not share any of your scheduled social messages',
							'user',
							'nelio-content'
						) }
						className="nelio-content-header__paused-social-publication-warning"
					>
						{ _x(
							'Paused',
							'text (social media publication)',
							'nelio-content'
						) }
					</span>
				</div>
			) }

			<div className="nelio-content-header__block nelio-content-header__toolbar">
				<ErrorPaneToggle className="nelio-content-header__toolbar-button nelio-content-header__toolbar-button--is-error" />
				<ToggleFilterPaneButton className="nelio-content-header__toolbar-button nelio-content-header__toolbar-button--is-filter" />
				<ReusableMessageToggle className="nelio-content-header__toolbar-button nelio-content-header__toolbar-button--is-reusable" />
				<ToggleUnscheduledViewButton className="nelio-content-header__toolbar-button nelio-content-header__toolbar-button--is-unscheduled" />
				<MoreOptions className="nelio-content-header__toolbar-button nelio-content-header__toolbar-button--is-more" />
			</div>
		</>
	);
};

// =====
// HOOKS
// =====

const useIsTodayVisible = () =>
	useSelect( ( select ) => {
		const { getToday, getFirstDayOfWeek } = select( NC_DATA );
		const { getFirstDay, getLastDay } = select( NC_CALENDAR );

		const firstDayOfWeek = getFirstDayOfWeek();
		const today = getToday();
		return (
			getFirstDay( firstDayOfWeek ) <= today &&
			today <= getLastDay( firstDayOfWeek )
		);
	} );

const useNavigationLabels = () => {
	const calendarMode = useSelect( ( select ) =>
		select( NC_CALENDAR ).getCalendarMode()
	);

	switch ( calendarMode ) {
		case 'month':
			return {
				prev: _x( 'Previous Month', 'text', 'nelio-content' ),
				next: _x( 'Next Month', 'text', 'nelio-content' ),
			};

		case 'two-weeks':
			return {
				prev: _x( 'Previous Two Weeks', 'text', 'nelio-content' ),
				next: _x( 'Next Two Weeks', 'text', 'nelio-content' ),
			};

		case 'week':
			return {
				prev: _x( 'Previous Week', 'text', 'nelio-content' ),
				next: _x( 'Next Week', 'text', 'nelio-content' ),
			};

		default:
			return {
				prev: _x( 'Previous Period', 'text', 'nelio-content' ),
				next: _x( 'Next Period', 'text', 'nelio-content' ),
			};
	} //end switch
};
