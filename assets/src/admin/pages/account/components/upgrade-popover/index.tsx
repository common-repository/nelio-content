/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import {
	Popover,
	Button,
	Spinner,
	RadioControl,
} from '@safe-wordpress/components';
import { useSelect, useDispatch } from '@safe-wordpress/data';
import { useState } from '@safe-wordpress/element';
import { _x } from '@safe-wordpress/i18n';

/**
 * External dependencies
 */
import { getShortLocale } from '@nelio-content/utils';
import type { Dict, Maybe, FSProduct, FSProductId } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';
import { useUpgradeableProducts } from '~/nelio-content-pages/account/hooks';
import { store as NC_ACCOUNT } from '~/nelio-content-pages/account/store';

export type UpgradePopoverProps = {
	readonly isOpen: boolean;
	readonly placement: Required< Popover.Props >[ 'placement' ];
	readonly onUpgrade: () => void;
	readonly onFocusOutside: () => void;
};

export const UpgradePopover = ( {
	isOpen,
	placement,
	onUpgrade,
	onFocusOutside,
}: UpgradePopoverProps ): JSX.Element | null => {
	const [ optionSelected, selectOption ] = useState< FSProductId >();

	const products = useUpgradeableProducts();
	const isLoading = useIsLoading();
	const { upgradeSubscription } = useDispatch( NC_ACCOUNT );

	if ( ! isOpen ) {
		return null;
	} //end if

	if ( isLoading ) {
		return (
			<Popover
				className="nelio-content-upgrade-form--loading"
				noArrow={ false }
				placement={ placement }
				onFocusOutside={ onFocusOutside }
			>
				<Spinner />
			</Popover>
		);
	} //end if

	return (
		<Popover
			className="nelio-content-upgrade-form"
			noArrow={ false }
			placement={ placement }
			onFocusOutside={ onFocusOutside }
		>
			<RadioControl
				className="nelio-content-upgrade-form__product-container"
				label={ _x( 'Subscription Plans', 'text', 'nelio-content' ) }
				selected={ optionSelected }
				options={ products.map( ( product ) => ( {
					/* eslint-disable @typescript-eslint/no-explicit-any */
					label: ( <ProductLabel { ...product } /> ) as any as string,
					/* eslint-enable @typescript-eslint/no-explicit-any */
					value: product.id,
				} ) ) }
				onChange={ selectOption }
			/>

			<div className="nelio-content-upgrade-form__button-container">
				<Button
					variant="primary"
					className="nelio-content-upgrade-form__button"
					disabled={ ! optionSelected }
					onClick={ () => {
						if ( ! optionSelected ) {
							return;
						} //end if
						onUpgrade();
						void upgradeSubscription( optionSelected );
					} }
				>
					{ _x( 'Upgrade', 'command', 'nelio-content' ) }
				</Button>
			</div>
		</Popover>
	);
};

const ProductLabel = ( { displayName, price, description }: FSProduct ) => {
	const currency = useCurrency();
	return (
		<div className="nelio-content-upgrade-form__product">
			<strong className="nelio-content-upgrade-form__product-name">
				{ localize( displayName ) }
			</strong>
			<span
				className="nelio-content-upgrade-form__product-price"
				title={ currency }
			>
				{ formatPrice( price[ currency ], currency ) }
			</span>
			<span className="nelio-content-upgrade-form__product-description">
				{ localize( description ) }
			</span>
		</div>
	);
};

// =====
// HOOKS
// =====

const useCurrency = () =>
	useSelect( ( select ) => {
		const account = select( NC_ACCOUNT ).getAccount();
		return 'free' === account.plan ? 'USD' : account.currency || 'USD';
	} );

const useIsLoading = () =>
	useSelect(
		( select ) =>
			! select( NC_ACCOUNT ).hasFinishedResolution( 'getProducts' )
	);

// =======
// HELPERS
// =======

const formatPrice = ( price: Maybe< number >, currency: string ) => {
	switch ( currency ) {
		case 'EUR':
			return `${ price ?? '—' }€`;
		case 'USD':
		default:
			return `$${ price ?? '—' }`;
	} //end switch
}; //end formatPrice()

const localize = ( strings: Dict< string > ) => {
	const locale = getShortLocale();
	return strings[ locale ] || strings.en;
}; //end localize()
