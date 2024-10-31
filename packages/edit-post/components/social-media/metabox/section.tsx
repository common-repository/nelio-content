/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';

export type SectionProps = {
	readonly children: JSX.Element | ReadonlyArray< JSX.Element >;
	readonly icon: Dashicon.Props[ 'icon' ];
	readonly title: string;
	readonly titleActions?: JSX.Element;
	readonly type: string;
};

export const Section = ( {
	children,
	icon,
	title,
	titleActions,
	type,
}: SectionProps ): JSX.Element => (
	<div className="nelio-content-social-media-metabox__section">
		<div className="nelio-content-social-media-metabox__section-title">
			<Dashicon icon={ icon } />
			{ title }
			{ !! titleActions && titleActions }
		</div>
		<div
			className={ `nelio-content-social-media-metabox__section-content nelio-content-social-media-metabox__section-content--is-${ type }` }
		>
			{ children }
		</div>
	</div>
);
