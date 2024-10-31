/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Button, TextControl } from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';
import { isUrl } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import './style.scss';
import { store as NC_FEEDS } from '~/nelio-content-pages/feeds/store';

export const NewFeedForm = (): JSX.Element => {
	const [ value, setValue ] = useValue();
	const [ isSaving, save ] = useSave();
	const isValid = isUrl( trim( value ) );

	return (
		<div className="nelio-content-new-feed-form">
			<TextControl
				className="nelio-content-new-feed-form__input-text"
				value={ value }
				onChange={ setValue }
				disabled={ isSaving }
				placeholder={ _x(
					'Write the URL of an RSS feed…',
					'user',
					'nelio-content'
				) }
			/>
			<Button
				className="nelio-content-new-feed-form__add-button"
				variant="primary"
				isBusy={ isSaving }
				onClick={ save }
				disabled={ isSaving || ! isValid }
			>
				{ isSaving
					? _x( 'Adding…', 'text', 'nelio-content' )
					: _x( 'Add', 'command', 'nelio-content' ) }
			</Button>
		</div>
	);
};

// =====
// HOOKS
// =====

const useValue = () => {
	const value = useSelect( ( select ) => select( NC_FEEDS ).getFeedUrl() );
	const { setNewFeedUrl } = useDispatch( NC_FEEDS );
	return [ value, setNewFeedUrl ] as const;
};

const useSave = () => {
	const isSaving = useSelect( ( select ) =>
		select( NC_FEEDS ).isAddingAFeed()
	);

	const [ value ] = useValue();
	const { addFeed } = useDispatch( NC_FEEDS );
	const save = async (): Promise< void > => {
		const url = trim( value );
		if ( isUrl( url ) ) {
			return addFeed( url );
		} //end if
	};

	return [ isSaving, save ] as const;
};
