/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Spinner } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';
import { _x } from '@safe-wordpress/i18n';

/**
 * Internal dependencies
 */
import './style.scss';
import { Site } from '../site';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export const Sites = (): JSX.Element | null => {
	const isLoading = useIsLoading();
	const sitesAllowed = useSitesAllowed();
	const sites = useSites();
	const sitesConnected = sites.length;

	if ( sitesAllowed <= 1 ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-account-container__box nelio-content-sites">
			<h3 className="nelio-content-sites__title">
				{ _x( 'Sites', 'text', 'nelio-content' ) }
				{ isLoading && <Spinner /> }
				<span className="nelio-content-sites__availability">
					{ ! isLoading && `${ sitesConnected } / ${ sitesAllowed }` }
				</span>
			</h3>

			<ul className="nelio-content-sites__list">
				{ ! isLoading &&
					sites.map( ( site ) => (
						<Site key={ site.id } site={ site } />
					) ) }
			</ul>
		</div>
	);
};

// =====
// HOOKS
// =====

const useIsLoading = () =>
	useSelect(
		( select ) => ! select( NC_ACCOUNT ).hasFinishedResolution( 'getSites' )
	);

const useSites = () =>
	useSelect( ( select ) => select( NC_ACCOUNT ).getSites() || [] );

const useSitesAllowed = () =>
	useSelect( ( select ) => {
		const account = select( NC_ACCOUNT ).getAccount();
		return account.plan === 'free' ? 1 : account.sitesAllowed;
	} );
