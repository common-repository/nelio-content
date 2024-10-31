/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button } from '@safe-wordpress/components';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { AuthorIcon } from '@nelio-content/components';
import { useAuthorName } from '@nelio-content/data';
import type { AuthorId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type FollowerProps = {
	readonly isAuthor: boolean;
	readonly remove: Maybe< () => void >;
	readonly userId: AuthorId;
};

export const Follower = ( {
	isAuthor,
	remove,
	userId,
}: FollowerProps ): JSX.Element => {
	const userName = useAuthorName( userId );
	return (
		<div className="nelio-content-notification-user">
			<div className="nelio-content-notification-user__icon">
				<AuthorIcon authorId={ userId } />
			</div>

			<div className="nelio-content-notification-user__info">
				<div className="nelio-content-notification-user__name">
					{ userName
						? userName
						: _x( 'Unknown User', 'text', 'nelio-content' ) }
				</div>

				<div className="nelio-content-notification-user__extra">
					{ isAuthor && (
						<span
							className={
								!! remove
									? 'nelio-content-notification-user__author nelio-content-notification-user__author--has-pipe'
									: 'nelio-content-notification-user__author'
							}
						>
							{ _x( 'Author', 'text', 'nelio-content' ) }
						</span>
					) }

					{ !! remove && (
						<Button
							className="nelio-content-notification-user__remove-action"
							isDestructive
							variant="link"
							onClick={ remove }
						>
							{ _x( 'Remove', 'command', 'nelio-content' ) }
						</Button>
					) }
				</div>
			</div>
		</div>
	);
};
