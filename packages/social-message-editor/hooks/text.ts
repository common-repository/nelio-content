/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import { filter, map, min } from 'lodash';
import {
	getCharLimitInNetwork,
	getMessageLength,
	getMinCharLimit,
} from '@nelio-content/networks';
import { computeSocialMessageText } from '@nelio-content/utils';

/**
 * Internal dependencies
 */
import { store as NC_SOCIAL_EDITOR } from '../store';

export const useText = (): [ string, ( text: string ) => void ] => {
	const text = useSelect( ( select ) =>
		select( NC_SOCIAL_EDITOR ).getText()
	);
	const { setText } = useDispatch( NC_SOCIAL_EDITOR );
	return [ text, setText ];
};

export const useTextComputed = (): string => {
	const limit = useMaxChars();
	return useSelect( ( select ) => {
		const { getPost, getText } = select( NC_SOCIAL_EDITOR );
		return computeSocialMessageText( limit, getPost(), getText() );
	} );
};

export const useCharCount = (): number => getMessageLength( useTextComputed() );

export const useMaxChars = (): number =>
	useSelect( ( select ): number => {
		const { getActiveSocialNetwork, getSelectedSocialNetworks } =
			select( NC_SOCIAL_EDITOR );
		const networks = filter( [
			getActiveSocialNetwork(),
			...getSelectedSocialNetworks(),
		] );
		return (
			min( map( networks, getCharLimitInNetwork ) ) || getMinCharLimit()
		);
	} );
