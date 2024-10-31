/**
 * WordPress dependencies
 */
import * as React from '@safe-wordpress/element';
import { Dashicon } from '@safe-wordpress/components';
import { useSelect } from '@safe-wordpress/data';

/**
 * External dependencies
 */
import type { QualityCheckType } from '@nelio-content/types';

/**
 * Internal dependencies
 */
import { store as NC_EDIT_POST } from '../../../store';

export type QualityCheckProps = {
	readonly icon: QualityCheckType[ 'icon' ];
	readonly name: string;
};

export const QualityCheck = ( {
	icon,
	name,
}: QualityCheckProps ): JSX.Element | null => {
	const status = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getQualityCheckStatus( name )
	);

	const rationale = useSelect( ( select ) =>
		select( NC_EDIT_POST ).getQualityCheckRationale( name )
	);

	if ( status === 'invisible' ) {
		return null;
	} //end if

	return (
		<div className="nelio-content-quality-analysis__quality-check">
			<div className="nelio-content-quality-analysis__quality-check-icon-wrapper">
				<div
					className={ `nelio-content-quality-analysis__quality-check-icon nelio-content-quality-analysis__quality-check-icon--is-${ status }` }
				>
					<Dashicon icon={ icon } />
				</div>
			</div>
			<div
				className={ `nelio-content-quality-analysis__quality-check-rationale nelio-content-quality-analysis__quality-check-rationale--is-${ status }` }
			>
				{ rationale }
			</div>
		</div>
	);
};
