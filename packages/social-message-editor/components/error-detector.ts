/**
 * WordPress dependencies
 */
import { useSelect } from '@safe-wordpress/data';
import { useEffect } from '@safe-wordpress/element';
import { _x, sprintf } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { find } from 'lodash';
import { store as NC_DATA } from '@nelio-content/data';
import { getRequirementsError } from '@nelio-content/networks';
import type { SocialProfile } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import {
	useActiveSocialNetwork,
	useDate,
	useMediaImage,
	useMediaVideo,
	useRelatedPostId,
	useSelectedProfiles,
	useSelectedTargets,
	useText,
	useTextComputed,
	useTime,
	useTypeByNetwork,
	useValidationError,
} from '../hooks';

export const ErrorDetector = (): null => {
	const [ { dateValue } ] = useDate();
	const [ { timeValue } ] = useTime();
	const [ text ] = useText();
	const textComputed = useTextComputed();
	const postId = useRelatedPostId();

	const network = useActiveSocialNetwork();
	const [ profileIds ] = useSelectedProfiles();
	const profiles = useSelect( ( select ) =>
		profileIds
			.map( ( id ) => select( NC_DATA ).getSocialProfile( id ) )
			.filter( ( p ): p is SocialProfile => !! p )
	);
	const targets = useSelectedTargets();
	const typeByNetwork = useTypeByNetwork();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [ _, setError ] = useValidationError();
	const clearErrors = () => setError( '' );

	const image = useMediaImage();
	const video = useMediaVideo();

	useEffect(
		voidify( () => {
			if ( ! profiles.length ) {
				return void setError(
					_x(
						'Please select a social profile',
						'user',
						'nelio-content'
					)
				);
			} //end if

			if ( text.includes( '{highlight}' ) ) {
				return void setError(
					sprintf(
						/* translators: a placeholder */
						_x(
							'Please remove %s (social template only)',
							'user',
							'nelio-content'
						),
						'{highlight}'
					)
				);
			} //end if

			if ( text.includes( '{phrase}' ) ) {
				return void setError(
					sprintf(
						/* translators: a placeholder */
						_x(
							'Please remove %s, as it can only be used in social templates',
							'user',
							'nelio-content'
						),
						'{phrase}'
					)
				);
			} //end if

			if ( ! dateValue ) {
				return void setError(
					_x( 'Please specify a date', 'user', 'nelio-content' )
				);
			} //end if

			if ( ! timeValue ) {
				return void setError(
					_x( 'Please specify a time', 'user', 'nelio-content' )
				);
			} //end if

			const p = find( profiles, { network } );
			const allProfiles = !! p ? [ p, ...profiles ] : profiles;
			for ( const profile of allProfiles ) {
				const error = getRequirementsError( {
					network: profile.network,
					postId,
					targetName: targets[ profile.id ]?.[ 0 ],
					textComputed,
					type: typeByNetwork[ profile.network ],
					image,
					video,
				} );

				if ( error ) {
					return void setError( error );
				} //end if
			} //end for

			return void clearErrors();
		} ),
		[
			dateValue,
			image?.id ?? 0,
			network,
			postId,
			profileIds,
			targets,
			textComputed,
			timeValue,
			typeByNetwork,
			video?.id ?? 0,
		]
	);

	return null;
};

// =======
// HELPERS
// =======

const voidify = ( fn: () => unknown ) => () => void fn();
