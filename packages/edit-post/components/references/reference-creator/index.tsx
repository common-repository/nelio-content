/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';
import { isURL } from '@safe-wordpress/url';

/**
 * External dependencies
 */
import { store as NC_DATA } from '@nelio-content/data';
import { isEmpty, isUrl } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_EDIT_POST } from '../../../store';

const ENTER_KEY = 13;

export const ReferenceCreator = (): JSX.Element => {
	const [ url, setUrl ] = useUrl();
	const suggest = useSuggest();

	const isCurrentUserAuthor = useIsCurrentUserAuthor();
	const isUrlValid = ! isEmpty( url ) && isURL( url );

	return (
		<div className="nelio-content-reference-creator">
			<TextControl
				autoComplete="off"
				placeholder={ _x( 'Enter a URL…', 'user', 'nelio-content' ) }
				value={ url }
				onChange={ setUrl }
				onKeyDown={ ( ev ) => {
					if ( ENTER_KEY !== ev.keyCode ) {
						return;
					} //end if
					ev.preventDefault();

					if ( ! isUrlValid ) {
						return;
					} //end if
					suggest();
				} }
			/>
			<Button
				variant="secondary"
				disabled={ ! isUrlValid }
				onClick={ suggest }
			>
				{ isCurrentUserAuthor
					? _x( 'Add', 'command', 'nelio-content' )
					: _x( 'Suggest', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};

// =====
// HOOKS
// =====

const useUrl = (): [ string, ( url: string ) => void ] => {
	const url = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getSuggestedReferenceUrl()
	);
	const { setSuggestedReferenceUrl } = useDispatch( NC_EDIT_POST );
	return [ url, setSuggestedReferenceUrl ];
};

const useSuggest = () => {
	const [ url, setUrl ] = useUrl();
	const { suggestReference } = useDispatch( NC_EDIT_POST );
	return () => {
		if ( isUrl( url ) ) {
			void suggestReference( url );
		} //end if
		setUrl( '' );
	};
};

const useIsCurrentUserAuthor = () =>
	useSelect(
		( select ) =>
			select( NC_DATA ).getCurrentUserId() ===
			select( NC_EDIT_POST ).getAuthorId()
	);
