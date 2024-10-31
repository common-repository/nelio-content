/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { store as NC_DATA } from '@nelio-content/data';
import { getFirstLatinizedLetter } from '@nelio-content/utils';
import type { AuthorId, Maybe } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type AuthorIconProps = {
	readonly authorId: Maybe< AuthorId >;
	readonly className?: string;
};

export const AuthorIcon = ( {
	className = '',
	authorId,
}: AuthorIconProps ): JSX.Element => {
	const author = useSelect( ( select ) =>
		select( NC_DATA ).getAuthor( authorId )
	);

	const name = author?.name || '';
	const photo = author?.photo;
	const letter = getFirstLatinizedLetter( name );

	return (
		<div
			className={ classnames( {
				'nelio-content-author-icon': true,
				[ `nelio-content-author-icon--is-letter-${ letter }` ]:
					!! letter,
				[ className ]: true,
			} ) }
		>
			<div
				className="nelio-content-author-icon__actual-profile-picture"
				style={ {
					backgroundImage: photo ? `url(${ photo })` : undefined,
				} }
			></div>
		</div>
	);
};
