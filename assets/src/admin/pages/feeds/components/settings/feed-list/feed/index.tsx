/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, ExternalLink } from '@safe-wordpress/components';
import { useDispatch, useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { DeleteButton } from '@nelio-content/components';
import { store as NC_DATA } from '@nelio-content/data';
import type { FeedId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export type FeedProps = {
	readonly feedId: FeedId;
};

export const Feed = ( { feedId }: FeedProps ): JSX.Element | null => {
	const feed = useSelect( ( select ) => select( NC_DATA ).getFeed( feedId ) );
	const isAddingAFeed = useSelect( ( select ) =>
		select( NC_FEEDS ).isAddingAFeed()
	);
	const isDeleting = useSelect( ( select ) =>
		select( NC_FEEDS ).isDeletingFeed( feedId )
	);

	const { openEditor, deleteFeed } = useDispatch( NC_FEEDS );

	if ( ! feed ) {
		return null;
	} //end if

	const { name = '', url, icon, twitter = '' } = feed ?? {};
	const edit = () => openEditor( feedId, { name, twitter } );

	return (
		<div
			className={ classnames( {
				'nelio-content-feed': true,
				'nelio-content-feed--is-deleting': isDeleting,
			} ) }
		>
			<div className="nelio-content-feed__name">{ name }</div>

			<div className="nelio-content-feed__url">
				{ isDeleting ? (
					<span>{ url }</span>
				) : (
					<ExternalLink href={ url }>{ url }</ExternalLink>
				) }
			</div>

			{ !! twitter && (
				<div className="nelio-content-feed__twitter">
					{ 'X (Twitter): ' }
					{ isDeleting ? (
						<span>{ twitter.substring( 1 ) }</span>
					) : (
						<ExternalLink
							href={ `https://twitter.com/${ twitter.substring(
								1
							) }` }
						>
							{ twitter.substring( 1 ) }
						</ExternalLink>
					) }
				</div>
			) }

			<div className="nelio-content-feed__icon">
				<div
					className="nelio-content-feed__actual-icon"
					style={ {
						backgroundColor: icon ? 'transparent' : undefined,
						backgroundImage: icon ? `url(${ icon })` : undefined,
					} }
				></div>
			</div>

			{ isDeleting ? (
				<div className="nelio-content-feed__feedback">
					<DeleteButton
						isDeleting={ true }
						onClick={ () => void null }
					/>
				</div>
			) : (
				<div className="nelio-content-feed__actions">
					<Button
						variant="link"
						disabled={ isAddingAFeed }
						onClick={ edit }
					>
						{ _x( 'Edit', 'command', 'nelio-content' ) }
					</Button>
					{ ' | ' }
					<DeleteButton
						onClick={ () => deleteFeed( feedId ) }
						disabled={ isAddingAFeed }
					/>
				</div>
			) }
		</div>
	);
};
