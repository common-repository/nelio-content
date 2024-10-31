/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { CheckboxControl } from '@safe-wordpress/components';

export type PostTypeProps = {
	readonly name: string;
	readonly boldLabel?: boolean;
	readonly checked: boolean;
	readonly label: string | JSX.Element;
	readonly onChange: ( checked: boolean ) => void;
};

export const PostType = ( {
	name,
	boldLabel,
	checked,
	label,
	onChange,
}: PostTypeProps ): JSX.Element => (
	<li
		className={ `nelio-content-post-filters__post-type nelio-content-post-filters__post-type--${ name }` }
	>
		<CheckboxControl
			label={ boldLabel ? <strong>{ label }</strong> : label }
			checked={ checked }
			onChange={ onChange }
		/>
	</li>
);
