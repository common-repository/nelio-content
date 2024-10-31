/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { TextareaControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { createComment, isEmpty } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

export const Input = (): JSX.Element => {
	const [ value, setValue ] = useValue();
	const save = useSave();
	return (
		<div className="nelio-content-editorial-comments-input">
			<TextareaControl
				placeholder={ _x(
					'Write a comment and press enter to send…',
					'user',
					'nelio-content'
				) }
				className="nelio-content-editorial-comments-input__textarea"
				value={ value }
				onChange={ setValue }
				onKeyDown={ ( ev ) => {
					if ( 'Enter' !== ev.key ) {
						return;
					} //end if
					ev.preventDefault();
					save();
				} }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useValue = () => {
	const value = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getEditorialCommentInputValue()
	);
	const { setEditorialCommentInputValue } = useDispatch( NC_EDIT_POST );
	return [ value, setEditorialCommentInputValue ] as const;
};

const useSave = () => {
	const [ value, setValue ] = useValue();
	const { createEditorialComment } = useDispatch( NC_EDIT_POST );

	const postId = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getPostId()
	);
	const postType = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getPostType()
	);

	if ( ! postId || ! postType ) {
		return () => void null;
	} //end if

	return () => {
		const comment = trim( value );
		if ( isEmpty( comment ) ) {
			return;
		} //end if

		void setValue( '' );
		void createEditorialComment( {
			...createComment( postId, postType ),
			comment,
		} );
	};
};
