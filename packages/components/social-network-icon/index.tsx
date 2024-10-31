/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';
import type { SocialKindName, SocialNetworkName } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import './style.scss';

export type SocialNetworkIconProps = {
	readonly className?: string;
	readonly disabled?: boolean;
	readonly network: SocialNetworkName;
	readonly kind?: SocialKindName;
	readonly mini?: boolean;
};

export const SocialNetworkIcon = ( {
	className = '',
	disabled,
	network,
	kind,
	mini = false,
}: SocialNetworkIconProps ): JSX.Element => {
	const baseClassName = 'nelio-content-social-network-icon';
	const hasKind = kind && 'single' !== kind;
	const icon = hasKind ? `${ network }-${ kind }` : network;

	return (
		<div
			className={ classnames( {
				[ baseClassName ]: true,

				[ `${ baseClassName }--is-${ icon }` ]: ! mini && ! disabled,
				[ `${ baseClassName }--is-mini-${ icon }` ]: mini && ! disabled,

				[ `${ baseClassName }--is-${ icon }-disabled` ]:
					! mini && disabled,
				[ `${ baseClassName }--is-mini-${ icon }-disabled` ]:
					mini && disabled,

				[ className ]: !! className,
			} ) }
		>
			<span className="screen-reader-text">{ network }</span>
		</div>
	);
};
