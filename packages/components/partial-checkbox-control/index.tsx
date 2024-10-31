/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { BaseControl } from '@safe-wordpress/components';
import { useInstanceId } from '@safe-wordpress/compose';
import { Icon, check } from '@safe-wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';

export type PartialCheckboxControlProps = {
	readonly label: string | JSX.Element;
	readonly className?: string;
	readonly heading?: string;
	readonly checked?: boolean;
	readonly isPartialCheck?: boolean;
	readonly help?: string;
	readonly onChange: ( checked: boolean ) => void;
};

export const PartialCheckboxControl = ( {
	label,
	className,
	heading,
	checked,
	isPartialCheck,
	help,
	onChange,
}: PartialCheckboxControlProps ): JSX.Element => {
	const instanceId = useInstanceId( PartialCheckboxControl );
	const id = `inspector-partial-checkbox-control-${ instanceId }`;

	return (
		<BaseControl
			label={ heading }
			id={ id }
			help={ help }
			className={ className }
		>
			<span className="components-checkbox-control__input-container nelio-content-partial-checkbox-control">
				<input
					id={ id }
					className="components-checkbox-control__input"
					type="checkbox"
					value="1"
					onChange={ ( ev ) => onChange( !! ev.target.checked ) }
					checked={ checked }
					aria-describedby={ !! help ? id + '__help' : undefined }
				/>
				{ !! checked && ! isPartialCheck && (
					<Icon
						icon={ check }
						className="components-checkbox-control__checked"
						role="presentation"
					/>
				) }
				{ !! checked && !! isPartialCheck && (
					<Icon
						icon={ minus }
						className="components-checkbox-control__checked"
						role="presentation"
					/>
				) }
			</span>
			<label
				className="components-checkbox-control__label"
				htmlFor={ id }
			>
				{ label }
			</label>
		</BaseControl>
	);
};

// =======
// HELPERS
// =======

const minus = (
	<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<rect x="6" y="11" width="11" height="2" />
	</svg>
);
