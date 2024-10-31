/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { uniq, without } from 'lodash';
import { AuthorSearcher } from '@nelio-content/components';
import type { AuthorId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { Follower } from './follower';
import { store as NC_EDIT_POST } from '../../store';

export const Notifications = (): JSX.Element => {
	const [ followers, setFollowers ] = useFollowers();
	const authorId = useAuthorId();
	const shouldAuthorFollow = useShouldAuthorFollow();

	const addFollower = ( followerId: AuthorId ) =>
		setFollowers( uniq( [ ...followers, followerId ] ) );
	const removeFollower = ( followerId: AuthorId ) =>
		setFollowers( without( followers, followerId ) );

	return (
		<div className="nelio-content-notifications">
			<div className="nelio-content-notifications__user-searcher">
				<AuthorSearcher
					placeholder={ _x(
						'Select a user…',
						'user',
						'nelio-content'
					) }
					onChange={ ( id ) => void ( id && addFollower( id ) ) }
				/>
			</div>
			<div className="nelio-content-notifications__followers">
				{ followers.map( ( userId ) => (
					<Follower
						key={ userId }
						userId={ userId }
						isAuthor={ userId === authorId }
						remove={
							userId === authorId && shouldAuthorFollow
								? undefined
								: () => removeFollower( userId )
						}
					/>
				) ) }
			</div>
		</div>
	);
};

// =====
// HOOKS
// =====

const useAuthorId = () =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getAuthorId() );

const useShouldAuthorFollow = () =>
	useSelect( ( select ) => select( NC_EDIT_POST ).getAuthorId() );

const useFollowers = () => {
	const authorId = useAuthorId();
	const followers = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getFollowers()
	);
	const { setFollowers } = useDispatch( NC_EDIT_POST );

	const expectedFollowers =
		useShouldAuthorFollow() && authorId
			? uniq( [ authorId, ...followers ] )
			: followers;

	return [ expectedFollowers, setFollowers ] as const;
};
