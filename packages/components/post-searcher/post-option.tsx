/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { OptionProps } from 'react-select';
import { usePost } from '@nelio-content/data';
import { dateI18n, getSettings } from '@nelio-content/date';
import type { PostId } from '@nelio-content/types';

export type PostData = {
	readonly value: PostId;
	readonly label: string;
};

export const PostOption = ( {
	data: { value },
	isFocused,
	isSelected,
	innerRef,
	innerProps,
}: OptionProps< PostData > ): JSX.Element => {
	const {
		authorName = '',
		date,
		thumbnailSrc,
		title = '',
		typeName = '',
	} = usePost( value ) || {};

	return (
		<div
			ref={ innerRef }
			className={ classnames( {
				'nelio-content-post-option-in-post-searcher': true,
				'nelio-content-post-option-in-post-searcher--is-focused':
					isFocused,
				'nelio-content-post-option-in-post-searcher--is-selected':
					isSelected,
			} ) }
			{ ...innerProps }
		>
			<div className="nelio-content-post-option-in-post-searcher__image">
				<div
					className="nelio-content-post-option-in-post-searcher__actual-image"
					style={ {
						backgroundImage: thumbnailSrc
							? `url(${ thumbnailSrc })`
							: '',
					} }
				></div>
			</div>

			<div className="nelio-content-post-option-in-post-searcher__title">
				{ title }
			</div>

			<div className="nelio-content-post-option-in-post-searcher__details">
				{ !! authorName
					? sprintf(
							/* translators: 1 -> post type name, 2 -> author name */
							_x( '%1$s by %2$s', 'text', 'nelio-content' ),
							typeName,
							authorName
					  )
					: typeName }
				{ ` • ${ formatI18nDate( date || '' ) }` }
			</div>
		</div>
	);
};

// =======
// HELPERS
// =======

const formatI18nDate = ( date: string ) =>
	dateI18n( getSettings().formats.date, date );
