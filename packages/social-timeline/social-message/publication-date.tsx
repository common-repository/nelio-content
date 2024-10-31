/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { _nx, _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { dateI18n, getSettings } from '@nelio-content/date';
import type { PostStatusSlug, SocialMessage } from '@nelio-content/types';

export type PublicationDateProps = {
	readonly isBeingDeleted: boolean;
	readonly postStatus: PostStatusSlug;
} & Pick<
	SocialMessage,
	'source' | 'dateType' | 'dateValue' | 'schedule' | 'timeType' | 'timeValue'
>;

export const PublicationDate = ( props: PublicationDateProps ): JSX.Element => {
	const { isBeingDeleted, source } = props;
	const date = getDate( props );
	return (
		<div
			className={ classnames( {
				'nelio-content-social-message__date': true,
				'nelio-content-social-message__date--is-deleting':
					isBeingDeleted,
			} ) }
		>
			{ 'reshare-template' === source && <Dashicon icon="share-alt" /> }
			{ 'publication-template' === source && (
				<Dashicon icon="megaphone" />
			) }
			{ [ 'user-highlight', 'custom-sentence' ].includes( source ) && (
				<Dashicon icon="editor-quote" />
			) }
			{ 'auto-extracted-sentence' === source && (
				<Dashicon icon="format-status" />
			) }
			{ date }
		</div>
	);
};

// =====
// HOOKS
// =====

function getDate( props: PublicationDateProps ) {
	const { dateType, schedule, postStatus } = props;
	if ( 'publish' === postStatus || 'exact' === dateType ) {
		return dateI18n( getSettings().formats.datetime, schedule );
	} //end if

	const { dateValue, timeType, timeValue } = props;
	if ( '0' === dateValue ) {
		if ( 'exact' === timeType ) {
			return timeValue;
		} //end if

		if ( '0' === timeValue ) {
			return _x( 'Same time as publication', 'text', 'nelio-content' );
		} //end if

		const hours = Math.abs( Number.parseInt( timeValue ) ) || 0;
		return sprintf(
			/* translators: number of hours */
			_nx(
				'%d hour after publication',
				'%d hours after publication',
				hours,
				'text',
				'nelio-content'
			),
			hours
		);
	} //end if

	const days = Math.abs( Number.parseInt( dateValue ) ) || 0;
	return sprintf(
		/* translators: 1 -> number of days, 2 -> time */
		_nx(
			'%1$d day after publication at %2$s',
			'%1$d days after publication at %2$s',
			days,
			'text',
			'nelio-content'
		),
		days,
		timeValue
	);
} //end getDate()
