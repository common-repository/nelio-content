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
import classnames from 'classnames';
import { trim } from 'lodash';
import { store as NC_DATA, useFeatureGuard } from '@nelio-content/data';
import { store as NC_SOCIAL_EDITOR } from '@nelio-content/social-message-editor';

/**
 * Internal dependencies
 */
import './style.scss';
import { ReusableMessage } from './reusable-message';
import { Searcher } from './searcher';

export type ReusableMessagesProps = {
	readonly className?: string;
};

export const ReusableMessages = ( {
	className = '',
}: ReusableMessagesProps ): JSX.Element => {
	const query = useQuery();
	const messages = useReusableMessages( query );
	const canCreateReusableMessages = useSelect( ( select ) =>
		select( NC_DATA ).canCurrentUserCreateMessagesAlways()
	);
	const profile = useSelect(
		( select ) => select( NC_DATA ).getSocialProfiles()[ 0 ]
	);

	const guard = useFeatureGuard(
		'calendar/create-reusable-messages',
		canCreateReusableMessages
	);
	const { openNewSocialMessageEditor } = useDispatch( NC_SOCIAL_EDITOR );

	return (
		<div
			className={ classnames( {
				'nelio-content-reusable-messages': true,
				[ className ]: true,
			} ) }
		>
			<div className="nelio-content-reusable-messages__title">
				<div>
					{ _x(
						'Reusable',
						'text (social messages)',
						'nelio-content'
					) }
				</div>
			</div>

			{ canCreateReusableMessages && (
				<div className="nelio-content-reusable-messages__actions">
					<Button
						className="nelio-content-reusable-messages__header-button nelio-content-reusable-messages__add-item-icon"
						icon="insert"
					/>

					<Button
						className="nelio-content-reusable-messages__header-button nelio-content-reusable-messages__add-reusable-message"
						icon="share"
						label={ _x(
							'Add New Reusable Message',
							'command',
							'nelio-content'
						) }
						tooltipPosition="bottom center"
						disabled={ ! canCreateReusableMessages }
						onClick={ guard( () =>
							openNewSocialMessageEditor(
								{
									profileId: profile?.id,
									network: profile?.network,
									timeType: 'time-interval',
									timeValue: 'morning',
								},
								{
									context: 'calendar',
									reusableMessage: true,
								}
							)
						) }
					/>
				</div>
			) }

			<Searcher className="nelio-content-reusable-messages__searcher" />

			<div className="nelio-content-reusable-messages__list">
				{ ! messages.length && <NoMessagesWarning /> }
				{ messages.map( ( item ) => (
					<ReusableMessage key={ item.id } id={ item.id } />
				) ) }
			</div>

			<LoadMore />
		</div>
	);
};

const NoMessagesWarning = () => {
	const query = useQuery();
	const status = useStatus( query );
	if ( status === 'loaded' ) {
		return (
			<div className="nelio-content-reusable-messages__no-messages">
				{ trim( query )
					? _x(
							'No reusable messages found',
							'text',
							'nelio-content'
					  )
					: _x( 'No reusable messages', 'text', 'nelio-content' ) }
			</div>
		);
	} //end if

	return (
		<div className="nelio-content-reusable-messages__no-messages">
			<Spinner />
			<span>{ _x( 'Loading…', 'text', 'nelio-content' ) }</span>
		</div>
	);
};

const LoadMore = () => {
	const query = useQuery();
	const status = useStatus( query );
	const { loadReusableMessages } = useDispatch( NC_DATA );

	if ( status !== 'pending' ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-reusable-messages__load-more-action">
			<Button
				variant="secondary"
				onClick={ () => void loadReusableMessages( query ) }
			>
				{ _x(
					'Load More',
					'command (reusable messages)',
					'nelio-content'
				) }
			</Button>
		</div>
	);
};

// =====
// HOOKS
// =====

const useQuery = () =>
	useSelect( ( select ) => select( NC_DATA ).getReusableMessageQuery() );

const useReusableMessages = ( query: string ) =>
	useSelect( ( select ) => select( NC_DATA ).getReusableMessages( query ) );

const useStatus = ( query: string ) =>
	useSelect( ( select ) =>
		select( NC_DATA ).getReusableMessageQueryStatus( query )
	);
