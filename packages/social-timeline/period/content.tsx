/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import moment from 'moment';
import { filter, map, sortBy } from 'lodash';
import {
	store as NC_DATA,
	useFeatureGuard,
	useIsSubscribed,
} from '@nelio-content/data';
import { isEmpty, isRecurringMessage } from '@nelio-content/utils';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';
import type {
	Post,
	SocialMessage as SM,
	TimelinePeriod,
	Uuid,
} from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { filterUsingDate, filterUsingOffset, getDateTimeAttrs } from './utils';

import { SocialMessage } from '../social-message';
import type { SocialMessageProps } from '../social-message';
import { PremiumFeatureButton } from '@nelio-content/components';

export type PeriodContentProps = {
	readonly period: TimelinePeriod;
	readonly deletingMessageIds?: ReadonlyArray< Uuid >;
} & Omit< SocialMessageProps, 'messageId' | 'isBeingDeleted' >;

export const PeriodContent = ( props: PeriodContentProps ): JSX.Element => {
	const { period, deletingMessageIds = [], ...messageProps } = props;
	const { post, isTimelineBusy = false } = messageProps;
	const messageIds = useMessageIds( period, post );
	const isSubscribed = useIsSubscribed();

	const addSocialMessage = useMessageAdder( period, post, isTimelineBusy );
	const canActuallyCreateMessages = useCanCreateMessages(
		post,
		isTimelineBusy
	);
	const couldSubscriberCreateMessages = useCouldSubscriberCreateMessages(
		post,
		isTimelineBusy
	);

	const isCreationPremium =
		couldSubscriberCreateMessages && ! canActuallyCreateMessages;

	return (
		<div className="nelio-content-social-media-timeline-period__period-content">
			{ ! isEmpty( messageIds ) && (
				<div className="nelio-content-social-media-timeline-period__messages">
					{ messageIds.map( ( messageId ) => (
						<SocialMessage
							key={ messageId }
							messageId={ messageId }
							isBeingDeleted={ deletingMessageIds.includes(
								messageId
							) }
							{ ...messageProps }
						/>
					) ) }
				</div>
			) }

			<div className="nelio-content-social-media-timeline-period__add-button-wrapper">
				{ ! isSubscribed && 'day' !== period ? (
					<PremiumFeatureButton
						feature="edit-post/custom-timeline"
						label={ _x(
							'Add Social Message',
							'command',
							'nelio-content'
						) }
						size="small"
					/>
				) : (
					<Button
						className={ classnames( {
							'nelio-content-social-media-timeline-period__add-button':
								true,
							'nelio-content-premium-feature-button nelio-content-premium-feature-button--is-premium':
								isCreationPremium,
						} ) }
						variant={ isCreationPremium ? undefined : 'secondary' }
						size="small"
						disabled={ ! couldSubscriberCreateMessages }
						onClick={ addSocialMessage }
						icon={ isCreationPremium ? 'lock' : undefined }
					>
						{ _x(
							'Add Social Message',
							'command',
							'nelio-content'
						) }
					</Button>
				) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useMessageIds = ( period: TimelinePeriod, post: Post ) =>
	useSelect( ( select ) => {
		const { getSocialMessagesRelatedToPost } = select( NC_DATA );
		const messages = getSocialMessagesRelatedToPost( post.id )
			.filter( ( message ) => 'publish' !== message.status )
			.filter(
				( message: SM, _: number, allMessages: ReadonlyArray< SM > ) =>
					! isRecurringMessage( message ) ||
					isFirstRecurringMessage( allMessages, message )
			);

		const { getUtcNow } = select( NC_DATA );
		const filterCondition =
			'publish' === post.status
				? filterUsingDate( period, moment( getUtcNow() ) )
				: filterUsingOffset( period );

		return map( filter( messages, filterCondition ), 'id' );
	} );

const useMessageAdder = (
	period: TimelinePeriod,
	post: Post,
	isTimelineBusy?: boolean
) => {
	const canActuallyCreateMessages = useCanCreateMessages(
		post,
		isTimelineBusy
	);
	const couldSubscriberCreateMessages = useCouldSubscriberCreateMessages(
		post,
		isTimelineBusy
	);
	const guard = useFeatureGuard(
		'edit-post/create-more-messages',
		couldSubscriberCreateMessages && ! canActuallyCreateMessages
	);

	const attrs = getDateTimeAttrs( period );
	const disabledProfileIds = useSelect( ( select ) =>
		select( NC_DATA ).getProfilesWithMessagesRelatedToPost( post.id )
	);

	const { openNewSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );
	return guard( () =>
		openNewSocialMessageEditor( attrs, {
			context: 'post',
			post,
			disabledProfileIds,
		} )
	);
};

const useCanCreateMessages = ( post: Post, isTimelineBusy?: boolean ) =>
	useSelect(
		( select ) =>
			select( NC_DATA ).canCurrentUserCreateMessagesRelatedToPost(
				post
			) && ! isTimelineBusy
	);

const useCouldSubscriberCreateMessages = (
	post: Post,
	isTimelineBusy?: boolean
) =>
	useSelect(
		( select ) =>
			select( NC_DATA ).couldSubscriberCreateMessagesRelatedToPost(
				post
			) && ! isTimelineBusy
	);

// =======
// HELPERS
// =======

const isFirstRecurringMessage = ( ms: ReadonlyArray< SM >, m: SM ) => {
	const messages = ms.filter(
		( x ) => x.recurrenceGroup === m.recurrenceGroup
	);
	const sorted = sortBy( messages, 'schedule' );
	return sorted[ 0 ] === m;
};
